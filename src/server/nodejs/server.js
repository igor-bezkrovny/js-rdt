(function () {
	var http = require("http"),
		fs = require("fs"),
		sys = require("sys"),
		url = require("url"),
		queryString = require('querystring');

	var server = null;

	var REQUEST_TYPES = {
		GET : "GET",
		POST : "POST",
		HEAD : "HEAD"
	};

	/**
	 * @class HandlerDescription
	 * @param {function(req, res, query, requestData)} handlerFunction
	 * @param {Array.<REQUEST_TYPES>} supportedRequestTypesArray
	 * @constructor
	 */
	var RequestHandlerDescription = function(thisObject, handlerFunction, supportedRequestTypesArray) {
		this.handlerFunction = handlerFunction;
		this.supportedRequestTypesArray = supportedRequestTypesArray;
		this.thisObject = thisObject;
	};

	var requestHandlersDescriptionMap = {};

	function serverHandler(req, res) {
		var pathName = url.parse(req.url).pathname;

		if (req.method === 'OPTIONS') {
			console.log('!OPTIONS');
			var headers = {};
			// IE8 does not allow domains to be specified, just the *
			// headers["Access-Control-Allow-Origin"] = req.headers.origin;
			headers["Access-Control-Allow-Origin"] = "*";
			headers["Access-Control-Allow-Methods"] = "POST, GET, PUT, DELETE, OPTIONS";
			headers["Access-Control-Allow-Credentials"] = false;
			headers["Access-Control-Max-Age"] = '86400'; // 24 hours
			headers["Access-Control-Allow-Headers"] = "X-Forwarded-For, X-Requested-With, X-HTTP-Method-Override, Content-Type, Accept";
			res.writeHead(200, headers);
			res.end();
			return;
		}

		//console.log("request: " + pathName);
		if(typeof requestHandlersDescriptionMap[pathName] !== 'undefined') {
			var requestHandlerDescription = requestHandlersDescriptionMap[pathName];

			if(requestHandlerDescription.supportedRequestTypesArray.indexOf(req.method) >= 0) {
				var requestBody = '';

				req.on('data', function(chunk) {
					requestBody += chunk.toString();
				});
				req.on('end', function() {
					if(requestHandlerDescription.handlerFunction) {
						var requestBodyObject = requestBody.length > 0 ? JSON.parse(requestBody) : null,
							requestQueryObject = url.parse(req.url).query ? queryString.parse(url.parse(req.url).query) : null;

						res.simpleJSON = function (code, obj) {
							var body = new Buffer(JSON.stringify(obj));
							res.writeHead(code, {
								"Content-Type": "text/json",
								"Content-Length": body.length,
								"Access-Control-Allow-Origin" : "*"
							});
							res.end(body);
						};
						res.simpleText = function (code, text) {
							console.log(text);
							res.writeHead(code, {
								"Content-Type": "text/plain",
								"Content-Length": text.length,
								"Access-Control-Allow-Origin" : "*"
							});
							res.end(text);
						};

						requestHandlerDescription.handlerFunction.call(requestHandlerDescription.thisObject, req, res, requestQueryObject, requestBodyObject);
					} else {
						res.writeHead(404, "Not found", {
							'Content-Type': 'text/html',
							"Access-Control-Allow-Origin" : "*"
						});
						res.end('<html><head><title>404 - Not found</title></head><body><h1>Not found.</h1></body></html>');
						console.log("[404] " + req.method + " to " + req.url);
					}
				});
			} else {
				res.writeHead(404, "Not found", {
					'Content-Type': 'text/html',
					"Access-Control-Allow-Origin" : "*"
				});
				res.end('<html><head><title>404 - Not found</title></head><body><h1>Not found.</h1></body></html>');
				console.log("[404] " + req.method + " to " + req.url);
			}
		} else {
			res.writeHead(404, "Not found", {
				'Content-Type': 'text/html',
				"Access-Control-Allow-Origin" : "*"
			});
			res.end('<html><head><title>404 - Not found</title></head><body><h1>Not found.</h1></body></html>');
			console.log("[404] " + req.method + " to " + req.url);
		}
	}

	function fileNameExtension (path) {
		var index = path.lastIndexOf(".");
		return index < 0 ? "" : path.substring(index);
	}

	module.exports = {
		create : function(host, port) {
			if(server === null) {
				server = http.createServer(serverHandler);
				server.listen(port, host);
				console.log("server listening: host = " + host + ", port = " + port);
			}
		},

		/**
		 * @public
		 * @param filename
		 * @returns {Function}
		 */
		serveFileHandler : function (filename) {
			var body, headers,
				content_type = lookupExtension(fileNameExtension(filename));

			// returns MIME type for extension, or fallback, or octet-steam
			function lookupExtension(ext, fallback) {
				// List of most common mime-types, stolen from Rack.
				var TYPES           = { ".3gp" : "video/3gpp", ".a" : "application/octet-stream", ".ai" : "application/postscript", ".aif" : "audio/x-aiff", ".aiff" : "audio/x-aiff", ".asc" : "application/pgp-signature", ".asf" : "video/x-ms-asf", ".asm" : "text/x-asm", ".asx" : "video/x-ms-asf", ".atom" : "application/atom+xml", ".au" : "audio/basic", ".avi" : "video/x-msvideo", ".bat" : "application/x-msdownload", ".bin" : "application/octet-stream", ".bmp" : "image/bmp", ".bz2" : "application/x-bzip2", ".c" : "text/x-c", ".cab" : "application/vnd.ms-cab-compressed", ".cc" : "text/x-c", ".chm" : "application/vnd.ms-htmlhelp", ".class" : "application/octet-stream", ".com" : "application/x-msdownload", ".conf" : "text/plain", ".cpp" : "text/x-c", ".crt" : "application/x-x509-ca-cert", ".css" : "text/css", ".csv" : "text/csv", ".cxx" : "text/x-c", ".deb" : "application/x-debian-package", ".der" : "application/x-x509-ca-cert", ".diff" : "text/x-diff", ".djv" : "image/vnd.djvu", ".djvu" : "image/vnd.djvu", ".dll" : "application/x-msdownload", ".dmg" : "application/octet-stream", ".doc" : "application/msword", ".dot" : "application/msword", ".dtd" : "application/xml-dtd", ".dvi" : "application/x-dvi", ".ear" : "application/java-archive", ".eml" : "message/rfc822", ".eps" : "application/postscript", ".exe" : "application/x-msdownload", ".f" : "text/x-fortran", ".f77" : "text/x-fortran", ".f90" : "text/x-fortran", ".flv" : "video/x-flv", ".for" : "text/x-fortran", ".gem" : "application/octet-stream", ".gemspec" : "text/x-script.ruby", ".gif" : "image/gif", ".gz" : "application/x-gzip", ".h" : "text/x-c", ".hh" : "text/x-c", ".htm" : "text/html", ".html" : "text/html", ".ico" : "image/vnd.microsoft.icon", ".ics" : "text/calendar", ".ifb" : "text/calendar", ".iso" : "application/octet-stream", ".jar" : "application/java-archive", ".java" : "text/x-java-source", ".jnlp" : "application/x-java-jnlp-file", ".jpeg" : "image/jpeg", ".jpg" : "image/jpeg", ".js" : "application/javascript", ".json" : "application/json", ".log" : "text/plain", ".m3u" : "audio/x-mpegurl", ".m4v" : "video/mp4", ".man" : "text/troff", ".mathml" : "application/mathml+xml", ".mbox" : "application/mbox", ".mdoc" : "text/troff", ".me" : "text/troff", ".mid" : "audio/midi", ".midi" : "audio/midi", ".mime" : "message/rfc822", ".mml" : "application/mathml+xml", ".mng" : "video/x-mng", ".mov" : "video/quicktime", ".mp3" : "audio/mpeg", ".mp4" : "video/mp4", ".mp4v" : "video/mp4", ".mpeg" : "video/mpeg", ".mpg" : "video/mpeg", ".ms" : "text/troff", ".msi" : "application/x-msdownload", ".odp" : "application/vnd.oasis.opendocument.presentation", ".ods" : "application/vnd.oasis.opendocument.spreadsheet", ".odt" : "application/vnd.oasis.opendocument.text", ".ogg" : "application/ogg", ".p" : "text/x-pascal", ".pas" : "text/x-pascal", ".pbm" : "image/x-portable-bitmap", ".pdf" : "application/pdf", ".pem" : "application/x-x509-ca-cert", ".pgm" : "image/x-portable-graymap", ".pgp" : "application/pgp-encrypted", ".pkg" : "application/octet-stream", ".pl" : "text/x-script.perl", ".pm" : "text/x-script.perl-module", ".png" : "image/png", ".pnm" : "image/x-portable-anymap", ".ppm" : "image/x-portable-pixmap", ".pps" : "application/vnd.ms-powerpoint", ".ppt" : "application/vnd.ms-powerpoint", ".ps" : "application/postscript", ".psd" : "image/vnd.adobe.photoshop", ".py" : "text/x-script.python", ".qt" : "video/quicktime", ".ra" : "audio/x-pn-realaudio", ".rake" : "text/x-script.ruby", ".ram" : "audio/x-pn-realaudio", ".rar" : "application/x-rar-compressed", ".rb" : "text/x-script.ruby", ".rdf" : "application/rdf+xml", ".roff" : "text/troff", ".rpm" : "application/x-redhat-package-manager", ".rss" : "application/rss+xml", ".rtf" : "application/rtf", ".ru" : "text/x-script.ruby", ".s" : "text/x-asm", ".sgm" : "text/sgml", ".sgml" : "text/sgml", ".sh" : "application/x-sh", ".sig" : "application/pgp-signature", ".snd" : "audio/basic", ".so" : "application/octet-stream", ".svg" : "image/svg+xml", ".svgz" : "image/svg+xml", ".swf" : "application/x-shockwave-flash", ".t" : "text/troff", ".tar" : "application/x-tar", ".tbz" : "application/x-bzip-compressed-tar", ".tcl" : "application/x-tcl", ".tex" : "application/x-tex", ".texi" : "application/x-texinfo", ".texinfo" : "application/x-texinfo", ".text" : "text/plain", ".tif" : "image/tiff", ".tiff" : "image/tiff", ".torrent" : "application/x-bittorrent", ".tr" : "text/troff", ".txt" : "text/plain", ".vcf" : "text/x-vcard", ".vcs" : "text/x-vcalendar", ".vrml" : "model/vrml", ".war" : "application/java-archive", ".wav" : "audio/x-wav", ".wma" : "audio/x-ms-wma", ".wmv" : "video/x-ms-wmv", ".wmx" : "video/x-ms-wmx", ".wrl" : "model/vrml", ".wsdl" : "application/wsdl+xml", ".xbm" : "image/x-xbitmap", ".xhtml" : "application/xhtml+xml", ".xls" : "application/vnd.ms-excel", ".xml" : "application/xml", ".xpm" : "image/x-xpixmap", ".xsl" : "application/xml", ".xslt" : "application/xslt+xml", ".yaml" : "text/yaml", ".yml" : "text/yaml", ".zip" : "application/zip" };
				return TYPES[ext.toLowerCase()] || fallback || 'application/octet-stream';
			}

			function loadResponseData (callback) {
				if (body && headers) {
					callback();
					return;
				}

				sys.puts("loading " + filename + "...");
				fs.readFile(filename, function (err, data) {
					if (err) {
						sys.puts("Error loading " + filename);
					} else {
						body = data;
						headers = {
							"Content-Type" : content_type,
							"Content-Length" : body.length,
							"Access-Control-Allow-Origin" : "*"
						};
						headers["Cache-Control"] = "public";
						sys.puts("static file " + filename + " loaded");
						callback();
					}
				});
			}

			return function (req, res) {
				loadResponseData(function () {
					res.writeHead(200, headers);
					res.end(req.method === "HEAD" ? "" : body);
				});
			}
		},

		/**
		 * @public
		 * @param path
		 * @param handler
		 */
		get : function (path, thisObject, handler) {
			requestHandlersDescriptionMap[path] = new RequestHandlerDescription(thisObject, handler, [ REQUEST_TYPES.GET ]);
		},

		/**
		 * @public
		 * @param path
		 * @param handler
		 */
		post : function (path, thisObject, handler) {
			requestHandlersDescriptionMap[path] = new RequestHandlerDescription(thisObject, handler, [ REQUEST_TYPES.POST ]);
		},

		/**
		 * @public
		 */
		close : function () {
			if(server !== null) {
				server.close();
				server = null;
			}
		}

	};

})();