// create global nameSpace.
// To be sure, that there is no javascript files Before TGModuleLoader
// we create nameSpace object without checking if it is already exists!

var ns = {};

var TGModuleLoader;
(function() {

	/**
	 * @type {Array.<{requirementsArray:number, callBack:function}>}
	 */
	var modules = [];

	function loadModule(index) {
		modules[index].callBack();
		modules.splice(index, 1);
	}

	function isNameSpaceExists(nameSpace) {
		var parts = nameSpace.split('.'),
			l = parts.length,
			currentNameSpace = ns;

		if(l < 1) {
			return true;
		}

		if(parts[0] !== 'ns') {
			console.log('custom namespaces unsupported');
			return false;
		}

		for(var i = 1; i < l; i++) {
			if(typeof currentNameSpace[parts[i]] !== 'undefined' && currentNameSpace[parts[i]] !== undefined) {
				currentNameSpace = currentNameSpace[parts[i]];
			} else {
				return false;
			}
		}
		return true;
	}

	function isAllNameSpacesExist(nameSpacesArray) {
		if(!nameSpacesArray || nameSpacesArray.length === 0) {
			return true;
		}

		var result = true;
		for(var j = nameSpacesArray.length - 1; j >= 0; j--) {
			if(!isNameSpaceExists(nameSpacesArray[j])) {
				result = false;
				break;
			}
		}
		return result;
	}

	function tryResolveModulesRequirements() {
		var loadedModulesNum = 0;

		for(var i = modules.length - 1; i >= 0; i--) {
			var module = modules[i];
			if(isAllNameSpacesExist(module.requirementsArray)) {
				//console.log(module.requirementsArray);
				loadModule(i);
				loadedModulesNum++;
			}
		}
		return loadedModulesNum;
	}

	TGModuleLoader = {
		/**
		 * @public
		 * @param {Array.<string>} requirementsArray
		 * @param {Function} callBack
		 */
		add : function(requirementsArray, callBack) {
			if(isAllNameSpacesExist(requirementsArray)) {
				callBack();
			} else {
				modules.push({
					requirementsArray : requirementsArray,
					callBack          : callBack
				});

				// try resolve immediately to keep stack of modules as small as possible
				while(tryResolveModulesRequirements() > 0) {}
			}
		},

		/**
		 * @public
		 */
		resolve : function() {
			while(modules.length > 0) {
				var num = tryResolveModulesRequirements();
				if(num === 0) {
					for(var i = 0; i < modules.length; i++) {
						console.log(modules[i].callBack.toString());
					}
					throw "TGModuleLoader: can't resolve dependencies for all modules";
					break;
				}
			}
			console.log("TGModuleLoader: all dependencies successfully resolved");
		}
	};

})();

