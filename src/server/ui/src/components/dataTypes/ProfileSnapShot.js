NSModuleLoader.add([ 'ns.components.dataTypes.AbstractTime' ], function () {

	ns.components = ns.components || {};
	ns.components.dataTypes = ns.components.dataTypes || {};

	/**
	 * @public
	 * @class ns.components.dataTypes.ProfileSnapShot
	 * @extends ns.components.dataTypes.AbstractTime
	 */
	ns.components.dataTypes.ProfileSnapShot = ns.components.dataTypes.AbstractTime.createChild( /** @lends {ns.components.dataTypes.ProfileSnapShot} */ {
		/**
		 * @constructs
		 */
		init : function() {
		}

	});

});
