var should = require('should');

describe('parseTarget', function () {

	var parseTarget = require('../lib/parse-target');

	describe('given URL with only protocol and host', function () {
		var url, data;
		beforeEach(function () {
			url = 'http://example.com';
			data = parseTarget(url);
		});
		it('should return something', function () {
			should(data).be.ok();
		});
		it('should have correct origin', function () {
			should(data.origin).equal('http://example.com');
		});
		it('should have correct context', function () {
			should(data.context).equal('/');
		});
	});

	describe('given URL with path', function () {
		var url, data;
		beforeEach(function () {
			url = 'http://example.com/api';
			data = parseTarget(url);
		});
		it('should have correct origin', function () {
			should(data.origin).equal('http://example.com');
		});
		it('should have correct context', function () {
			should(data.context).equal('/api');
		});
	});

	describe('given URL with port', function () {
		var url, data;
		beforeEach(function () {
			url = 'http://example.com:8080';
			data = parseTarget(url);
		});
		it('should have correct origin', function () {
			should(data.origin).equal('http://example.com:8080');
		});
		it('should have correct context', function () {
			should(data.context).equal('/');
		});
	});

});