var url = require('url');

function parseTarget(value) {
	var parts = url.parse(value);
	return {
		origin: url.format({
			protocol: parts.protocol,
			host: parts.host
		}),
		context: parts.pathname
	};
}

module.exports = parseTarget;