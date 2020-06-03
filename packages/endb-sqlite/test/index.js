'use strict';

const Endb = require('endb');
const EndbSqlite = require('@endb/sqlite');
const { endbTest, adapterTest } = require('@endb/test');
const uri = 'sqlite://test.sqlite';
const store = new EndbSqlite({
  uri,
  busyTimeout: 30000
});

adapterTest(
  test,
  Endb,
  uri,
  'sqlite://non/existent/database.sqlite'
);
endbTest(test, Endb, { store });
