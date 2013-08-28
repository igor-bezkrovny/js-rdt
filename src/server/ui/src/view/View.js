NSModuleLoader.add([ 'ns.frameWork.Class', 'ns.config' ], function () {

	ns.view = ns.view || {};

	/**
	 * @public
	 * @class ns.view.View
	 */
	ns.view.View = ns.frameWork.Class.createChild( /** @lends {ns.view.View} */ {
		/**
		 * @constructs
		 */
		init : function() {

		},

		/**
		 *
		 * @param state
		 */
		setState : function(state) {
			var changeServer = document.getElementById(ns.config.data.HTML_IDS.CHANGE_SERVER),
				logger = document.getElementById(ns.config.data.HTML_IDS.LOGGER),
				profiler = document.getElementById(ns.config.data.HTML_IDS.PROFILER),
				screenShotter = document.getElementById(ns.config.data.HTML_IDS.SCREENSHOTTER),
				menu = document.getElementById(ns.config.data.HTML_IDS.MENU);

			changeServer.style.display = 'none';
			logger.style.display = 'none';
			profiler.style.display = 'none';
			screenShotter.style.display = 'none';
			menu.style.display = 'none';
			switch(state) {
				case ns.config.data.STATES.CHANGE_SERVER:
					changeServer.style.display = '';
					break;
				case ns.config.data.STATES.LOGGER:
					logger.style.display = '';
					menu.style.display = '';
					break;
				case ns.config.data.STATES.PROFILER:
					profiler.style.display = '';
					menu.style.display = '';
					break;
				case ns.config.data.STATES.SCREENSHOTTER:
					screenShotter.style.display = '';
					menu.style.display = '';
					break;
			}
		}
	});

});
