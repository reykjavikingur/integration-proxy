var express = require('express');
var httpProxy = require('http-proxy');
var harmon = require('harmon');
var parseTarget = require('./parse-target');
var liberateCookies = require('./liberate-cookies');
var fixAttribute = require('./fix-attribute');

/**
 * Creates Express router with configurations for a conditional reverse proxy
 * @param options {Object}
 * @returns {Function}
 */
function integrationProxy(options) {

	if (!Boolean(options)) {
		throw new Error('integrationProxy requires options argument');
	}
	if (!Boolean(options.target)) {
		throw new Error('integrationProxy options requires target');
	}

	var target = parseTarget(options.target);
	var transform = options.transform;

	var router = express.Router();

	var proxy = httpProxy.createProxyServer({
		target: target.origin
	});

	function handleProxyError(err, req, res) {
		var message = [
			'Proxy request failed: "',
			err.message,
			'" ',
			req.url
		].join('');
		console.error(message);
		res.writeHead(500, {
			'content-type': 'text/plain'
		});
		res.end('Proxy request failed.');
	}

	proxy.on('error', handleProxyError);

	function handleProxyRes(proxyRes, req, res) {
		// proxyRes is IncomingMessage
		// res is ServerResponse, OutgoingMessage
		try {
			if (proxyRes.headers['content-length']) {
				delete proxyRes.headers['content-length'];
			}
			if (proxyRes.headers['set-cookie']) {
				proxyRes.headers['set-cookie'] = liberateCookies(proxyRes.headers['set-cookie']);
			}
			if (proxyRes.headers['location'] && transform) {
				proxyRes.headers['location'] = transform(proxyRes.headers['location']);
			}
		}
		catch (e) {
			console.error('[Proxy] response error: ', e);
		}
	}

	proxy.on('proxyRes', handleProxyRes);

	if (transform) {

		var fixContent = harmon([], [
			{
				query: 'a',
				func: fixAttribute('href', transform)
			},
			{
				query: 'form',
				func: fixAttribute('action', transform)
			}
		], true);

		router.use(fixContent);
	}

	var urlPrefix = target.context.replace(/\/$/, '');

	router.use('/', function (req, res, next) {
		req.url = urlPrefix + req.url;
		proxy.web(req, res, {
			target: target.origin,
			changeOrigin: true
		});
	});

	return router;
}

module.exports = integrationProxy;