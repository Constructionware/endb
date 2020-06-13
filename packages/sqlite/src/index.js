'use strict';

const util = require('util');
const sqlite3 = require('sqlite3');
const EndbSql = require('@endb/sql');

/**
 * EndbSqlite
 * @extends EndbSql
 */
class EndbSqlite extends EndbSql {
	/**
	 * @typedef {Object} EndbSqliteOptions
	 * @property {string} [options.uri] The database URI
	 * @property {string} [table='endb'] The table
	 * @property {number} [busyTimeout] The maximum time after which the database will not be usable
	 */

	/**
	 * Creates a new EndbSqlite instance
	 * @param {EndbSqliteOptions} [options={}]
	 */
	constructor(options = {}) {
		const {uri = 'sqlite://:memory:'} = options;
		super({
			dialect: 'sqlite',
			async connect() {
				return new Promise((resolve, reject) => {
					const path = uri.replace(/^sqlite:\/\//, '');
					const db = new sqlite3.Database(path, error => {
						if (error) {
							reject(error);
						} else {
							if (options.busyTimeout) {
								db.configure('busyTimeout', options.busyTimeout);
							}

							resolve(util.promisify(db.all.bind(db)));
						}
					});
				});
			},
			...options
		});
	}
}

module.exports = EndbSqlite;