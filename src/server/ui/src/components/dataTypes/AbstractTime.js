NSModuleLoader.add([ 'ns.frameWork.Class' ], function () {

	ns.components = ns.components || {};
	ns.components.dataTypes = ns.components.dataTypes || {};

	/**
	 * @protected
	 * @param {number} minimalNumberOfDigits
	 * @param {number|string} value
	 * @returns {string}
	 */
	function numberToZeroPaddedString (minimalNumberOfDigits, value) {
		value = value.toString();
		while (value.length < minimalNumberOfDigits) {
			value = '0' + value;
		}
		return value;
	}

	/**
	 * @protected
	 * @param {number} milliseconds
	 * @returns {string}
	 */
	function formatTime (milliseconds) {

		var date = new Date(parseInt(milliseconds)),
			minutes = date.getMinutes(),
			hours = date.getHours(),
			seconds = date.getSeconds(),
			milliSeconds = date.getMilliseconds();

		return numberToZeroPaddedString(2, hours) + ":" + numberToZeroPaddedString(2, minutes) + ":" + numberToZeroPaddedString(2, seconds) + ":" + numberToZeroPaddedString(3, milliSeconds);
	}

	/**
	 * @public
	 * @class ns.components.dataTypes.AbstractTime
	 */
	ns.components.dataTypes.AbstractTime = ns.frameWork.Class.createAbstractChild(/** @lends {ns.components.dataTypes.AbstractTime} */ {
		/**
		 * @constructs
		 * @param {number} milliseconds
		 */
		init : function (milliseconds) {
			this.milliseconds = milliseconds;
			this.time = formatTime(milliseconds);
		},

		/**
		 * @public
		 * @returns {number}
		 */
		getMilliseconds : function () {
			return this.milliseconds;
		},

		/**
		 * @public
		 * @returns {string}
		 */
		getTime : function () {
			return this.time;
		},

		/**
		 * @public
		 * @returns {Function}
		 */
		getClass : function () {
			return this.prototype.constructor;
		}
	});

});
