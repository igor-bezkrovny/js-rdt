(function() {
	function encodeText(text) {
		return encodeURIComponent(text).
			// Note that although RFC3986 reserves "!", RFC5987 does not, so we do not need to escape it
			replace(/['()]/g, escape). // i.e., %27 %28 %29
			replace(/\*/g, '%2A');
	}

	function sendMessage( msg )
	{
		var reqText = "http://127.0.0.1:8008/send?text=";
		reqText += encodeText(msg) + "&_=" + encodeText(new Date());

		var oReq = new XMLHttpRequest();
		oReq.open("get", reqText, true);
		oReq.send();
	}

	window.logger = {
		log : function( message ) {
			sendMessage( message );
		}
	}
})();
