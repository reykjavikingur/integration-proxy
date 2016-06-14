var _ = require('underscore');

function liberateCookies(cookies) {
	// preserve falsy cookies
	if (!Boolean(cookies)) {
		return cookies;
	}
	// force it to be an array
	if (!_.isArray(cookies)) {
		cookies = [cookies];
	}
	// remove all restrictions
	return _.map(cookies, liberateCookie);
}

function liberateCookie(cookie) {
	var delim = '; ';
	var parts = _.filter(cookie.split(delim), function (part) {
		// lift restriction on https
		if (/^secure$/i.test(part)) return false;
		// lift restriction on domain
		if (/^domain=/i.test(part)) return false;
		return true;
	});
	return parts.join(delim);
}

module.exports = liberateCookies;