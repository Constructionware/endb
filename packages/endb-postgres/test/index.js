'use strict';

const Endb = require('endb');
const EndbPostgres = require('../src');
const { endbTest, adapterTest } = require('@endb/test');
const {
  POSTGRES_HOST = 'postgres',
  POSTGRES_USER = 'postgres',
  POSTGRES_PASSWORD = 'endb',
  POSTGRES_DB = 'endb_test',
  POSTGRES_PORT = 5432
} = process.env;
const uri = `postgresql://${POSTGRES_USER}${
  POSTGRES_PASSWORD ? `:${POSTGRES_PASSWORD}` : ''
}@${POSTGRES_HOST}:${POSTGRES_PORT}/${POSTGRES_DB}`;

adapterTest(test, Endb, uri, 'postgresql://foo');
endbTest(test, Endb, {
    store: new EndbPostgres(uri)
});
