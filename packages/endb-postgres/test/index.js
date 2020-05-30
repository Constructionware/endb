'use strict';

const Endb = require('endb');
const EndbPostgres = require('..');
const { endbTest, adapterTest } = require('@endb/test');
const {
  POSTGRES_HOST = 'localhost',
  POSTGRES_USER = 'postgres',
  POSTGRES_PASSWORD,
  POSTGRES_DB = 'endb_test',
} = process.env;
const uri = `postgresql://${POSTGRES_USER}${
  POSTGRES_PASSWORD ? `:${POSTGRES_PASSWORD}` : ''
}@${POSTGRES_HOST}:5432/${POSTGRES_DB}`;

adapterTest(test, Endb, uri, 'postgresql://foo');
endbTest(test, Endb, {
    store: new EndbPostgres(uri)
});
