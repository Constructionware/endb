'use strict';

const Endb = require('endb');
const {apiTest, valueTest, clearEach} = require('@endb/test');
const EndbSql = require('@endb/sql');
const {promisify} = require('util');
const {Database} = require('sqlite3');

class TestSqlite extends EndbSql {
	constructor(options = {}) {
		options = {
			dialect: 'sqlite',
			db: ':memory:',
			...options
		};
		options.connect = async () =>
			new Promise((resolve, reject) => {
				const db = new Database(options.db, error => {
					if (error) {
						reject(error);
					} else {
						db.configure('busyTimeout', 30000);
						resolve(db);
					}
				});
			}).then(db => promisify(db.all).bind(db));
		super(options);
	}
}

const store = new TestSqlite();

describe('@endb/sql', () => {
	beforeEach(() => clearEach(Endb, {store}));

	describe('API', () => {
		apiTest(test, Endb, {store});
	});

	describe('value', () => {
		valueTest(test, Endb, {store});
	});

	afterEach(() => clearEach(Endb, {store}));
});
