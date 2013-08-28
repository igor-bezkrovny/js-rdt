/* Simple JavaScript Inheritance by John Resig http://ejohn.org/ MIT Licensed. Inspired by base2 and Prototype */
/* description: http://blog.buymeasoda.com/understanding-john-resigs-simple-javascript-i/ */

/**
 * @version 0.1
 * - original John Resig inheritance
 * - added checking for ABSTRACT_METHOD
 * - added checking for ABSTRACT_CLASS
 * (if child/base class has any property that equals Class.ABSTRACT_METHOD, new Class will throw error)
 */
TGModuleLoader.add(null, function () {
	ns.frameWork = ns.frameWork || {};

	var initializing = false, fnTest = /xyz/.test(function () {xyz;}) ? /\b_super\b/ : /.*/;

	/**
	 *  The base Class implementation (does nothing)
	 *  @class
	 *  @constructor
	 */
	function Class() {
	}

	ns.frameWork.Class = Class;

	/**
	 * @public
	 * @type {function}
	 */
	Class.ABSTRACT_METHOD = function() {};

	/**
	 * Create a new Class that inherits from this class
	 * @public
	 * @param {object} childPrototype properties of Child Class
	 * @param {boolean} [isClassAbstract=false] mark class Abstract
	 * @returns {Function} new constructed Class
	 */
	Class.extend = function (childPrototype, isClassAbstract) {
		var _super = this.prototype,
			isClassContainsAbstractMethod = false,
			NewClass,
			name;

		// Instantiate a base class (but only create the instance,
		// don't run the init constructor)
		initializing = true;
		var prototype = new this();
		initializing = false;

		// Copy the properties over onto the new prototype
		for (name in childPrototype) {
			// Check if we're overwriting an existing function
			prototype[name] = typeof childPrototype[name] == "function" &&
				typeof _super[name] == "function" && fnTest.test(childPrototype[name]) ?
				(function (name, fn) {
					return function () {
						var tmp = this._super;

						// Add a new ._super() method that is the same method
						// but on the super-class
						this._super = _super[name];

						// The method only need to be bound temporarily, so we
						// remove it when we're done executing
						var ret = fn.apply(this, arguments);
						this._super = tmp;

						return ret;
					};
				})(name, childPrototype[name]) :
				childPrototype[name];
		}

		for (name in prototype) {
			if (prototype[name] === Class.ABSTRACT_METHOD) {
				isClassContainsAbstractMethod = true;
			}
		}

		// The dummy class constructor
		NewClass = function () {
			if (!initializing) {
				if (isClassContainsAbstractMethod) {
					throw "Can't create instance of class with at least one non-implemented abstract method!";
				} else if (isClassAbstract === true) {
					throw "Can't create instance of Abstract Class!";
				} else if (this.init) {
					// All construction is actually done in the init method
					this.init.apply(this, arguments);
				}
			}
		};

		// Populate our constructed prototype object
		NewClass.prototype = prototype;

		// Enforce the constructor to be what we expect
		NewClass.prototype.constructor = NewClass;

		// And make this class extendable
		NewClass.extend = this.extend;//arguments.callee;
		NewClass.createAbstractChild = this.createAbstractChild;
		NewClass.createChild = this.createChild;


		return NewClass;
	};

	/**
	 * Create a new Class that inherits from this class
	 * Constructed Class will be Abstract (it is impossible to create instance of new class!)
	 * @public
	 * @param {object} childPrototype properties of Child Class
	 * @returns {Function} new constructed Class
	 */
	Class.createAbstractChild = function(childPrototype) {
		return this.extend(childPrototype, true);
	};

	/**
	 * Create a new Class that inherits from this class
	 * Constructed Class will be Abstract (it is impossible to create instance of new class!)
	 * @public
	 * @param {object} childPrototype properties of Child Class
	 * @returns {Function} new constructed Class
	 */
	Class.createChild = function(childPrototype) {
		return this.extend(childPrototype, false);
	};

});