var express = require('express');

var targetServer = express();

targetServer.get('/', function(req, res, next) {
	res.send('Hello, I am the target server.');
});

module.exports = targetServer;