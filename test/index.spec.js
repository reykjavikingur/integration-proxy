var should = require('should');

describe('integrationProxy', function () {

	var integrationProxy = require('../');

	it('should be a function', function () {
		should(integrationProxy).be.a.Function();
	});

	it('should fail when called without options', function () {
		should(function () {
			integrationProxy();
		}).throw();
	});

	it('should fail when called with options without target', function () {
		should(function () {
			integrationProxy({});
		}).throw();
	});

	it('should return function when called with options having target', function () {
		var mw = integrationProxy({target: 'http://remote.example'});
		should(mw).be.a.Function();
	});

});