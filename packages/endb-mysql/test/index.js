'use strict';

const Endb = require('endb');
const EndbMysql = require('@endb/mysql');
const { endbTest, adapterTest } = require('@endb/test');
const {
  MYSQL_HOST = 'mysql',
  MYSQL_USER = 'mysql',
  MYSQL_PASSWORD = 'endb',
  MYSQL_DATABASE = 'endb_test',
} = process.env;
const uri = `mysql://${MYSQL_USER}${
  MYSQL_PASSWORD ? `:${MYSQL_PASSWORD}` : ''
}@${MYSQL_HOST}/${MYSQL_DATABASE}`;

adapterTest(test, Endb, uri, 'mysql://foo');
endbTest(test, Endb, {
    store: new EndbMysql(uri)
});
