'use strict';

const Endb = require('endb');
const EndbSqlite = require('@endb/sqlite');
const { apiTest, adapterTest } = require('@endb/test');
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
apiTest(test, Endb, { store });
