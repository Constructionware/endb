'use strict';

const Endb = require('endb');
const { endbTest } = require('@endb/test');
const EndbSql = require('@endb/sql');
const { promisify } = require('util');
const { Database } = require('sqlite3');

class TestSqlite extends EndbSql {
  constructor(options = {}) {
    options = {
      dialect: 'sqlite',
      db: ':memory:',
      ...options,
    };
    options.connect = async () =>
      new Promise((resolve, reject) => {
        const db = new Database(options.db, (error) => {
          if (error) {
            reject(error);
          } else {
            db.configure('busyTimeout', 30000);
            resolve(db);
          }
        });
      }).then((db) => promisify(db.all).bind(db));
    super(options);
  }
}

endbTest(test, Endb, {
  store: new TestSqlite(),
});