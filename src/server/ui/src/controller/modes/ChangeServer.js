TGModuleLoader.add([ 'ns.frameWork.Class' ], function () {

	ns.controller = ns.controller || {};

	/**
	 * @public
	 * @class ns.controller.ChangeServer
	 */
	ns.controller.ChangeServer = ns.frameWork.Class.createChild( /** @lends {ns.controller.ChangeServer} */ {
		/**
		 * @constructs
		 */
		init : function(controller) {
			this.controller = controller;
			this.update();
		},

		onMouseClick : function(e) {
			if(e && e.target && e.target.id === 'screen.change_server.start') {
				this.startServer();
			}
		},

		onKeyDown : function(e) {
			console.log(e.keyCode + "," + e.id);
			if(e && e.keyCode === 13 && e.target && e.target.id === 'screen.change_server.start') {
				this.startServer();
			}
		},

		update : function() {
			document.getElementById('screen.change_server.host').value = ns.config.data.network.host;
			document.getElementById('screen.change_server.port').value = ns.config.data.network.port;
		},

		startServer : function() {
			ns.config.data.network.host = document.getElementById('screen.change_server.host').value;
			ns.config.data.network.port = document.getElementById('screen.change_server.port').value;
			ns.config.saveConfig();

			this.controller.startServer();
			this.controller.setState(ns.config.data.STATES.LOGGER);
		}

	});

});
