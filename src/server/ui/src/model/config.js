NSModuleLoader.add([ 'ns.frameWork.Class' ], function () {

	/**
	 * @class Config
	 */
	var Config = ns.frameWork.Class.createChild(/** @lends {Config} */ {
		/**
		 * @private
		 * @constructs
		 */
		init : function () {
			/**
			 * @public
			 */
			this.data = {
				HTML_IDS : {
					MENU          : "screen.menu",
					CHANGE_SERVER : "screen.change_server",
					LOGGER        : "screen.logger",
					PROFILER      : "screen.profiler",
					SCREENSHOTTER : {
						ROOT  : "screen.screenshotter",
						IMAGE : "screen.screenshotter.image"
					}
				},

				network : {
					host : "0.0.0.0",
					port : 8008
				},

				client : {
					lastID : 0
				},

				STATES : {
					CHANGE_SERVER : 0,
					LOGGER        : 1,
					PROFILER      : 2,
					SCREENSHOTTER : 3
				}
			};

			this.loadConfig();
		},

		/**
		 * @private
		 */
		loadConfig : function () {
			//localStorage.clear();
			if (typeof localStorage !== 'undefined') {
				var item = localStorage.getItem("remoteTools");
				if (item) {
					var data = JSON.parse(item);
					if (data) {
						for (var key in data) {
							if (Object.hasOwnProperty.call(data, key)) {
								this.data[key] = data[key];
							}
						}

					}
				}
			}
		},

		/**
		 * @public
		 */
		saveConfig : function () {
			if (typeof localStorage !== 'undefined') {
				localStorage.setItem("remoteTools", JSON.stringify(this.data));
			}
		}
	});

	/**
	 * @public
	 * @type {Config}
	 */
	ns.config = new Config();

});