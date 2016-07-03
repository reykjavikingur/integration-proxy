var config = require('./config');
var targetServer = require('./target-server');
var proxyServer = require('./proxy-server');

// starts target server and proxy server

console.log('starting basic demo');

targetServer.listen(config.targetPort, function(err) {
	if (err) {
		console.error('unable to start target server', err);
	} else {
		console.log('running target server on port ' + config.targetPort);
	}
});

proxyServer.listen(config.proxyPort, function(err) {
	if (err) {
		console.error('unable to start proxy server', err);
	} else {
		console.log('running proxy server on port ' + config.proxyPort);
	}
})