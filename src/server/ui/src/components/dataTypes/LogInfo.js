NSModuleLoader.add([ 'ns.components.dataTypes.AbstractTime' ], function () {

	ns.components = ns.components || {};
	ns.components.dataTypes = ns.components.dataTypes || {};

	/**
	 * @public
	 * @class ns.components.dataTypes.LogInfo
	 * @extends ns.components.dataTypes.AbstractTime
	 */
	ns.components.dataTypes.LogInfo = ns.components.dataTypes.AbstractTime.createChild( /** @lends {ns.components.dataTypes.LogInfo} */ {
		/**
		 * @constructs
		 * @param {string} text
		 * @param {Array.<string>|null} stackTraceStringsArray
		 */
		init : function(text, stackTraceStringsArray) {
			this.text = text;
			this.stackTraceStringsArray = stackTraceStringsArray;
		},

		/**
		 * @public
		 * @returns {Function}
		 */
		getType : function() {
			return ns.components.dataTypes.LogInfo;
		}

	});

});
