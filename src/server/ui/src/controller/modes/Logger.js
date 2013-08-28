NSModuleLoader.add([ 'ns.frameWork.Class' ], function () {

	ns.controller = ns.controller || {};

	/**
	 * @class LogObjectDescription
	 * @param time
	 * @param text
	 * @constructor
	 */
	var LogObjectDescription = ns.frameWork.Class.createChild( /** @lends {LogObjectDescription} */ {
		init: function(time, text) {
			this.time = time;
			this.text = text;
			this.formattedLogLine = "[" + this.formatTime(time) + "] " + this.formatText(text);
		},

		formatTime : function(timeMS) {
			function zeroPad(digits, n) {
				n = n.toString();
				while (n.length < digits)
					n = '0' + n;
				return n;
			}

			var date = new Date( parseInt( timeMS ) );

			var minutes = date.getMinutes().toString();
			var hours = date.getHours().toString();
			var seconds = date.getSeconds().toString();
			var milliSeconds = date.getMilliseconds().toString();
			return zeroPad(2, hours) + ":" + zeroPad(2, minutes) + ":" + zeroPad(2,seconds) + ":" + zeroPad(3,milliSeconds);
		},

		formatText : function(text) {
			return text;
		}

	});

	/**
	 * @public
	 * @class ns.controller.Logger
	 */
	ns.controller.Logger = ns.frameWork.Class.createChild( /** @lends {ns.controller.Logger} */ {
		/**
		 * @constructs
		 */
		init : function(controller) {
			this.log = [];
			this.controller = controller;
			this.paused = false;
			this.filter = "";

			var el = document.getElementById("screen.logger.filter");
			el.addEventListener('keyup', ns.frameWork.utils.bind(this.onKeyDown, this), false);
		},

		registerClient : function(id) {

		},

		updateData : function(id, data) {
			if(data && typeof data.time !== 'undefined' && typeof data.text !== 'undefined') {
				this.log.push(new LogObjectDescription(
					data.time,
					data.text
				));
				this.update();
			}
		},

		update : function() {
			if(this.paused) {
				return;
			}

			var log = "",
				el = document.getElementById("screen.logger.log"),
				scrollDown = false;

			for(var i = 0; i < this.log.length; i++) {
				var l = this.log[i].formattedLogLine;
				if(l.indexOf(this.filter) >= 0) {
					log += this.log[i].formattedLogLine + "\n";
				}
			}

			if(el.scrollTop + el.clientHeight === el.scrollHeight) {
				scrollDown = true;
			}
			el.value = log;
			if(scrollDown) {
				el.scrollTop = el.scrollHeight;
			}
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
				case 'screen.menu.profiler':
					this.controller.setState(ns.config.data.STATES.PROFILER);
					break;
				case 'screen.menu.screenshotter':
					this.controller.setState(ns.config.data.STATES.SCREENSHOTTER);
					break;

				case 'screen.logger.clear':
					this.log = [];
					this.update();
					break;

				case 'screen.logger.pause':
					this.paused = !this.paused;
					document.getElementById('screen.logger.pause').value = this.paused ? "Continue" : "Pause";
					this.update();
					break;

				case 'screen.logger.filter':
					setTimeout(ns.frameWork.utils.bind(function() {
						var el = document.getElementById("screen.logger.filter");
						this.filter = el.value;
						console.log("change filter: [" + this.filter + "]");
						this.update();
					}, this), 16);
					break;
			}
		}

	});

});
