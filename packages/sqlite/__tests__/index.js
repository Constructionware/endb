'use strict';

const Endb = require('endb');
const EndbSqlite = require('@endb/sqlite');
const {apiTest, adapterTest, valueTest, clearEach} = require('@endb/test');

const uri = 'sqlite://test.sqlite';
const store = new EndbSqlite({
	uri,
	busyTimeout: 30000
});

describe('@endb/mongo', () => {
	beforeEach(() => clearEach(Endb, {store}));

	describe('API', () => {
		apiTest(test, Endb, {store});
	});

	describe('value', () => {
		valueTest(test, Endb, {store});
	});

	describe('adapter', () => {
		adapterTest(test, Endb, uri, 'sqlite://non/existent/database.sqlite');
	});

	afterEach(() => clearEach(Endb, {store}));
});
