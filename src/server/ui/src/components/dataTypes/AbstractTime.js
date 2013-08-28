NSModuleLoader.add([ 'ns.frameWork.Class' ], function () {

	ns.components = ns.components || {};
	ns.components.dataTypes = ns.components.dataTypes || {};

	function zeroPad(digits, n) {
		n = n.toString();
		while (n.length < digits)
			n = '0' + n;
		return n;
	}

	function formatTime(milliseconds) {

		var date = new Date( parseInt( milliseconds ) );

		var minutes = date.getMinutes().toString();
		var hours = date.getHours().toString();
		var seconds = date.getSeconds().toString();
		var milliSeconds = date.getMilliseconds().toString();
		return zeroPad(2, hours) + ":" + zeroPad(2, minutes) + ":" + zeroPad(2,seconds) + ":" + zeroPad(3,milliSeconds);
	}

	/**
	 * @public
	 * @class ns.components.dataTypes.AbstractTime
	 */
	ns.components.dataTypes.AbstractTime = ns.frameWork.Class.createAbstractChild( /** @lends {ns.components.dataTypes.AbstractTime} */ {
		/**
		 * @constructs
		 * @param {number} milliseconds
		 */
		init : function(milliseconds) {
			this.milliseconds = milliseconds;
			this.time = formatTime(milliseconds);
		},

		/**
		 * @public
		 * @returns {number}
		 */
		getMilliseconds : function() {
			return this.milliseconds;
		},

		/**
		 * @public
		 * @returns {string}
		 */
		getTime : function() {
			return this.time;
		},

		/**
		 * @public
		 * @returns {Function}
		 */
		getClass : function() {
			return this.prototype.constructor;
		}
	});

});
