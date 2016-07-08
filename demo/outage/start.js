var express = require('express');
var integrationProxy = require('../../');

// starts proxy without live target to test proxy error handler

var proxyPort = 6660;
var proxyOrigin = 'http://localhost:' + proxyPort;
var targetOrigin = 'http://idonotexist'; // fake target

var server = express();

server.use(integrationProxy({
	target: targetOrigin,
	transform: function (url) {
		return url.replace(targetOrigin, proxyOrigin)
	}
}));

server.listen(proxyPort, function (err) {
	if (err) {
		console.error('unable to start server on port ' + proxyPort + ' due to: ' + err.message);
	}
	else {
		console.log('running proxy on port ' + proxyPort);
	}
});
