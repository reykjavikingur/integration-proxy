var url = require('url');

/**
 * Creates harmon function to transform attribute
 * @param attributeName {String}
 * @param transform {Function}
 * @returns {Function}
 */
function fixAttribute(attributeName, transform) {
	return function (elem, req, res) {
		elem.getAttribute(attributeName, function (value) {
			if (value) {
				var parts = url.parse(value);
				if (parts.host) {
					var fixedValue = transform(value);
					if (fixedValue !== value) {
						elem.setAttribute(attributeName, fixedValue);
					}
				}
			}
		});
	};
}

module.exports = fixAttribute;