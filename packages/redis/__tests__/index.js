'use strict';

const Endb = require('endb');
const EndbRedis = require('../src');
const {apiTest, adapterTest, valueTest, clearEach} = require('@endb/test');

const {REDIS_HOST = 'localhost'} = process.env;
const uri = `redis://${REDIS_HOST}`;
const store = new EndbRedis(uri);

describe('@endb/redis', () => {
	beforeEach(() => clearEach(Endb, {store}));

	describe('API', () => {
		apiTest(test, Endb, {store});
	});

	describe('value', () => {
		valueTest(test, Endb, {store});
	});

	describe('adapter', () => {
		adapterTest(test, Endb, uri, 'redis://foo');
	});

	afterEach(() => clearEach(Endb, {store}));
});
