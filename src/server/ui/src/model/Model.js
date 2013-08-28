TGModuleLoader.add([ 'ns.frameWork.Class' ], function () {

	ns.model = ns.model || {};

	/**
	 * @public
	 * @class ns.model.Model
	 */
	ns.model.Model = ns.frameWork.Class.createChild( /** @lends {ns.model.Model} */ {
		/**
		 * @constructs
		 */
		init : function() {
			//this.logger = new ns.model.Logger();
			//this.profiler = new ns.model.Profiler();
			//this.screenShotter = new ns.model.ScreenShotter();
		}
	});

});
