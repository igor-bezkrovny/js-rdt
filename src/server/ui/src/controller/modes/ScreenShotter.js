NSModuleLoader.add([ 'ns.frameWork.Class' ], function () {

	ns.controller = ns.controller || {};

	/**
	 * @public
	 * @class ns.controller.ScreenShotter
	 */
	ns.controller.ScreenShotter = ns.frameWork.Class.createChild( /** @lends {ns.controller.ScreenShotter} */ {
		/**
		 * @constructs
		 */
		init : function(controller) {
			this.controller = controller;
		},

		updateData : function(id, dataObject) {
			var el = document.getElementById(ns.config.data.HTML_IDS.SCREENSHOTTER.IMAGE);
			console.log(dataObject.dataURL.length);
			el.src = dataObject.dataURL;
			el.style.width = dataObject.width + "px";
			el.style.height = dataObject.height + "px";
			/*var ctx = el.getContext("2d");
			el.width = "1280px";
			el.height = "720px";
			ctx.putImageData(atob(dataObject.dataURL), 0, 0);*/
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
				case 'screen.menu.profiler':
					this.controller.setState(ns.config.data.STATES.PROFILER);
					break;

			}
		}

	});

});
