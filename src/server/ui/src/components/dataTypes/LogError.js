NSModuleLoader.add([ 'ns.components.dataTypes.AbstractTime' ], function () {

	ns.components = ns.components || {};
	ns.components.dataTypes = ns.components.dataTypes || {};

	/**
	 * @public
	 * @class ns.components.dataTypes.LogError
	 * @extends ns.components.dataTypes.AbstractTime
	 */
	ns.components.dataTypes.LogError = ns.components.dataTypes.AbstractTime.createChild( /** @lends {ns.components.dataTypes.LogError} */ {
		/**
		 * @constructs
		 * @param {string} errorMessage
		 * @param {string} fileName
		 * @param {number} lineNumber
		 */
		init : function(errorMessage, fileName, lineNumber) {
			this.errorMessage = errorMessage;
			this.fileName = fileName;
			this.lineNumber = lineNumber;
		}

	});

});
