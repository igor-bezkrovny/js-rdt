(function (global) {
	var URL = null, lastSendTime = Date.now(), logArray = [];//, ID = 0;

	function encodeText (text) {
		return encodeURIComponent(text).
			// Note that although RFC3986 reserves "!", RFC5987 does not, so we do not need to escape it
			replace(/['()]/g, escape). // i.e., %27 %28 %29
			replace(/\*/g, '%2A');
	}

	function submitJSON (page, object, callBack, synchronious, immidiate) {
		logArray.push(object);
		if(immidiate || Date.now() - lastSendTime >= 100) {
			if (object && (URL || page.indexOf("//") >= 0)) {
				var reqURL = URL ? URL + "/" + page : page;
				var oReq = new XMLHttpRequest();
				//object.id = ID;
				oReq.onload = callBack;
				oReq.open("post", reqURL, !synchronious);
				oReq.setRequestHeader("Content-Type", "text/plain");
				//oReq.setRequestHeader("Access-Control-Allow-Origin", "*");
				oReq.send(JSON.stringify({ list : logArray }));

				logArray = [];
			}
			lastSendTime = Date.now();
		}
	}

	var oldOnError = global.onerror;
	global.onerror = function (errorMsg, url, lineNumber) {
		var text = "\n", separator = "-- EXCEPTION --------------------------";
		text += separator + "\n";
		text += "EXCEPTION: " + errorMsg + "\n";
		text += "URL: " + url + "\n";
		text += "LINE NUMBER: " + lineNumber + "\n";
		text += separator;
		global.remoteUtils.logger.log(text);

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
				submitJSON(url + "/authenticate", getDeviceInfoObject(), function () {
					/*if (this.responseText) {
						ID = parseInt(this.responseText);
						URL = url;
					}*/
				}, false, true);
				URL = url;
			}
		},

		logger : {
			log   : function (msg) {
				submitJSON(
					"logger",
					{
						time : Date.now(),
						text : msg
					},
					null,
					false
				);
			}
		}
	};

})(window);