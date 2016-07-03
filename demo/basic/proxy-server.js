var express = require('express');
var config = require('./config');
var integrationProxy = require('../../');

var proxyServer = express();

var targetOrigin = 'http://localhost:' + config.targetPort;
var proxyOrigin = 'http://localhost:' + config.proxyPort;

proxyServer.use(integrationProxy({
	target: targetOrigin,
	transform: function(url) {
		return url.replace(targetOrigin, proxyOrigin)
	}
}));

module.exports = proxyServer;