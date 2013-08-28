NSModuleLoader.add([ 'ns.frameWork.Class' ], function () {

	ns.controller = ns.controller || {};

	/**
	 * @public
	 * @class ns.controller.Profiler
	 */
	ns.controller.Profiler = ns.frameWork.Class.createChild( /** @lends {ns.controller.Profiler} */ {
		/**
		 * @constructs
		 */
		init : function(controller) {
			this.controller = controller;
		},

		onMouseClick : function(e) {
			if(e && e.target && e.target.id) {
				this.applyId(e.target.id);
			}
		},

		onKeyDown : function(e) {
			if(!e) {
				e = window.event;
			}
			if(e && e.target && e.target.id) {
				this.applyId(e.target.id);
			}
		},

		applyId : function(id) {
			switch(id) {
				case 'screen.menu.change_server':
					this.controller.stopServer();
					this.controller.setState(ns.config.data.STATES.CHANGE_SERVER);
					break;
				case 'screen.menu.logger':
					this.controller.setState(ns.config.data.STATES.LOGGER);
					break;
				case 'screen.menu.screenshotter':
					this.controller.setState(ns.config.data.STATES.SCREENSHOTTER);
					break;

			}
		}

	});

});
