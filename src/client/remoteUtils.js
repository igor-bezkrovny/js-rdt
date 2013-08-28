(function (global) {
	var URL = null, lastSendTime = Date.now(), logArray = [];//, ID = 0;

	var dataStorage = [];

	var serverHelper = {
		encodePlainText : function (text) {
			return encodeURIComponent(text).
				// Note that although RFC3986 reserves "!", RFC5987 does not, so we do not need to escape it
				replace(/['()]/g, escape). // i.e., %27 %28 %29
				replace(/\*/g, '%2A');
		},

		addDataToQueue : function (page, object) {
			if (typeof dataStorage[page] === 'undefined') {
				dataStorage[page] = [];
			}

			dataStorage[page].push(object);
		},

		submitDataToPage : function (page, dataObject, async) {
			if (dataObject && (URL || page.indexOf("//") >= 0)) {
				var reqURL = URL ? URL + "/" + page : page;
				var oReq = new XMLHttpRequest();
				oReq.open("post", reqURL, async);
				oReq.setRequestHeader("Content-Type", "text/plain");
				oReq.send(JSON.stringify(dataObject));

			}
		},

		dataSender : function () {
			//console.olog("try send...");
			for (var key in dataStorage) {
				if (Object.hasOwnProperty.call(dataStorage, key)) {
					var dataChunkArray = dataStorage[key];
					if (dataChunkArray.length > 0) {
						//console.olog("data chunks sent: " + dataChunkArray.length);
						serverHelper.submitDataToPage(key, dataChunkArray, true);
						dataChunkArray.length = 0;
					}
				}
			}
		}
	};

	var oldOnError = global.onerror;
	global.onerror = function (errorMsg, url, lineNumber) {
		var text = "\n", separator = "-- EXCEPTION --------------------------";
		text += separator + "\n";
		text += "EXCEPTION: " + errorMsg + "\n";
		text += "URL: " + url + "\n";
		text += "LINE NUMBER: " + lineNumber + "\n";
		text += separator;
		global.remoteUtils.send.log(text);

		if (oldOnError) {
			return oldOnError(errorMsg, url, lineNumber);
		}

		return false;
	};

	function getDeviceInfoObject () {
		return {
			"product"  : navigator.product,
			"ua"       : navigator.userAgent,
			"platform" : navigator.platform,
			"os"       : navigator.oscpu,
			"url"      : location.href
		}
	}

	global.remoteUtils = {
		setServerURL : function (url) {
			if (URL === null) {
				serverHelper.submitDataToPage(url + "/authenticate", getDeviceInfoObject(), true);
				URL = url;
				setInterval(serverHelper.dataSender, 500);
			}
		},

		send : {
			log : function (msg) {
				//oldConsole.log.apply(oldConsole, arguments);
				if(URL === null) {
					console.log("RDT: call remoteUtils.setServerURL first!");
					//oldConsole.log("RDT: call remoteUtils.setServerURL first!");
					return;
				}
				/*serverHelper.addDataToQueue(
					"logger",
					{
						time : Date.now(),
						text : msg
					}
				);*/
				serverHelper.submitDataToPage(
					"logger",
					[{
						time : Date.now(),
						text : msg
					}],
					false
				);
			},

			screenShot : function(rootElement, width, height) {
				if(typeof rootElement === 'undefined') {
					rootElement = document.body;
				}
				if(typeof width === 'undefined') {
					width = 1280;
				}
				if(typeof height === 'undefined') {
					height = 720;
				}
				if(URL === null) {
					return;
				}
				var milliseconds = Date.now();
				if(typeof html2canvas !== 'undefined') {
					html2canvas(rootElement, {
						onrendered: function(canvas) {
							var dataURL = canvas.toDataURL("image/png");
							//console.log(dataURL.length);
							//document.body.appendChild(canvas);
							serverHelper.submitDataToPage(
								"screenShotter",
								{
									time : milliseconds,
									dataURL : dataURL,
									width: width,
									height: height
								},
								true
							);
						},
						width: width,
						height: height,
						useCORS : true,
						//allowTaint : true,
						logging : true,
						timeout : 0,
						letterRendering : true
					});
				} else {
					remoteUtils.send.log("html2canvas Module not included! Please add script src=\"" + URL + "/html2canvas.js\" to index.html first!");
				}
			}
		}
	};

	/*var oldConsole = console;
	try {
		global.console = {
			log : remoteUtils.send.log,
			info : remoteUtils.send.log,
			debug : remoteUtils.send.log
		};
	} catch(e) {

	} */

})(window);