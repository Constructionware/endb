'use strict';

const Endb = require('endb');
const EndbMysql = require('@endb/mysql');
const { apiTest, adapterTest } = require('@endb/test');
const {
  MYSQL_HOST = 'mysql',
  MYSQL_USER = 'mysql',
  MYSQL_PASSWORD = 'endb',
  MYSQL_DATABASE = 'endb_test',
} = process.env;
const uri = `mysql://${MYSQL_USER}${
  MYSQL_PASSWORD ? `:${MYSQL_PASSWORD}` : ''
}@${MYSQL_HOST}/${MYSQL_DATABASE}`;
const store = new EndbMysql({ uri });

adapterTest(test, Endb, uri, 'mysql://foo');
apiTest(test, Endb, { store });
