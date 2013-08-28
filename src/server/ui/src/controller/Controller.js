NSModuleLoader.add([ 'ns.frameWork.Class', 'ns.config' ], function () {

	ns.controller = ns.controller || {};

	/**
	 * @public
	 * @class ns.controller.Controller
	 */
	ns.controller.Controller = ns.frameWork.Class.createChild(/** @lends {ns.controller.Controller} */ {
		/**
		 * @constructs
		 */
		init : function () {
			this.associatedClients = [];

			this.model = new ns.model.Model();
			this.view = new ns.view.View();

			this.changeServer = new ns.controller.ChangeServer(this);
			this.logger = new ns.controller.Logger(this);
			this.profiler = new ns.controller.Profiler(this);
			this.screenShotter = new ns.controller.ScreenShotter(this);

			document.addEventListener('keydown', ns.frameWork.utils.bind(this.onKeyDown, this), false);
			document.addEventListener('click', ns.frameWork.utils.bind(this.onMouseClick, this), true);

			this.setState(ns.config.data.STATES.CHANGE_SERVER);
		},

		onKeyDown : function (e) {
			if (!e) {
				e = window.event;
			}
			switch (this.state) {
				case ns.config.data.STATES.CHANGE_SERVER:
					this.changeServer.onKeyDown(e);
					break;
				case ns.config.data.STATES.LOGGER:
					this.logger.onKeyDown(e);
					break;
				case ns.config.data.STATES.PROFILER:
					this.profiler.onKeyDown(e);
					break;
				case ns.config.data.STATES.SCREENSHOTTER:
					this.screenShotter.onKeyDown(e);
					break;
			}
		},

		onMouseClick : function (e) {
			if (!e) {
				e = window.event;
			}
			switch (this.state) {
				case ns.config.data.STATES.CHANGE_SERVER:
					this.changeServer.onMouseClick(e);
					break;
				case ns.config.data.STATES.LOGGER:
					this.logger.onMouseClick(e);
					break;
				case ns.config.data.STATES.PROFILER:
					this.profiler.onMouseClick(e);
					break;
				case ns.config.data.STATES.SCREENSHOTTER:
					this.screenShotter.onMouseClick(e);
					break;
			}
		},

		/**
		 * @private
		 * @param state
		 */
		setState : function (state) {
			this.state = state;
			this.view.setState(state);
		},

		stopServer : function () {
			ns.server.close();
		},

		/**
		 * @public
		 * @param host
		 * @param port
		 */
		startServer : function () {
			console.log("create server");
			ns.server.create(ns.config.data.network.host, ns.config.data.network.port);

			ns.server.get("/ttt.js", this, ns.server.serveFileHandler("client/ttt.js"));
			ns.server.get("/remoteUtils.js", this, ns.server.serveFileHandler("client/remoteUtils.js"));
			ns.server.get("/html2canvas.js", this, ns.server.serveFileHandler("client/html2canvas.js"));
			ns.server.get("/stacktrace.js", this, ns.server.serveFileHandler("client/stacktrace.js"));
			ns.server.get("/index.html", this, ns.server.serveFileHandler("client/index.html"));
			ns.server.get("/index.htm", this, ns.server.serveFileHandler("client/index.html"));
			ns.server.get("/", this, ns.server.serveFileHandler("client/index.html"));

			ns.server.post("/logger", this, function (req, res, requestQueryStringObject, requestBodyObject) {
				var id;
				if (typeof req.headers['X-Forwarded-For'] !== 'undefined') {
					id = req.headers['X-Forwarded-For'];
				} else {
					id = req.connection.remoteAddress;
				}
				if (requestBodyObject && typeof this.associatedClients[id] !== 'undefined') {
					for (var i = 0; i < requestBodyObject.length; i++) {
						this.logger.updateData(id, requestBodyObject[i]);
					}
				}
				res.simpleText(200, "OK");
			});

			ns.server.post("/screenShotter", this, function (req, res, requestQueryStringObject, requestBodyObject) {
				var id;
				if (typeof req.headers['X-Forwarded-For'] !== 'undefined') {
					id = req.headers['X-Forwarded-For'];
				} else {
					id = req.connection.remoteAddress;
				}
				if (requestBodyObject && typeof this.associatedClients[id] !== 'undefined') {
					this.screenShotter.updateData(id, requestBodyObject);
				}
				res.simpleText(200, "OK");
			});
			ns.server.post("/authenticate", this, function (req, res, requestQueryStringObject, requestBodyObject) {
				res.simpleText(200, "OK");

				if (requestBodyObject) {
					var id;
					if (typeof req.headers['X-Forwarded-For'] !== 'undefined') {
						id = req.headers['X-Forwarded-For'];
					} else {
						id = req.connection.remoteAddress;
					}
					this.logger.registerClient(id);
					this.associatedClients[id] = true;

					this.logger.updateData(id, { time : Date.now(), text : "userAgent: " + requestBodyObject.ua });
					this.logger.updateData(id, { time : Date.now(), text : "product:   " + requestBodyObject.product });
					this.logger.updateData(id, { time : Date.now(), text : "platform:  " + requestBodyObject.platform });
					this.logger.updateData(id, { time : Date.now(), text : "os:        " + requestBodyObject.os });
					this.logger.updateData(id, { time : Date.now(), text : "url:       " + requestBodyObject.url });
				}
			});

			ns.server.post("/profiler", this, function (req, res, requestQueryStringObject, requestBodyObject) {
				this.profiler.updateData(requestBodyObject);
				res.simpleText(200, "OK");
			});
		}
	});

});