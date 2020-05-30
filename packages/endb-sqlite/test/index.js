'use strict';

const Endb = require('endb');
const EndbSqlite = require('@endb/sqlite');
const { endbTest, adapterTest } = require('@endb/test');

adapterTest(
  test,
  Endb,
  'sqlite://test.sqlite',
  'sqlite://non/existent/database.sqlite'
);
endbTest(test, Endb, {
  store: new EndbSqlite({ uri: 'sqlite://test.sqlite', busyTimeout: 30000 }),
});
