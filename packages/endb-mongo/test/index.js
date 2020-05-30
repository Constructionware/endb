'use strict';

const Endb = require('endb');
const EndbMongo = require('..');
const { endbTest, adapterTest } = require('@endb/test');
const { MONGO_HOST = '127.0.0.1' } = process.env;
const uri = `mongodb://${MONGO_HOST}:27017`;

adapterTest(test, Endb, uri, 'mongodb://127.0.0.1:1234');
endbTest(test, Endb, {
    store: new EndbMongo(uri)
});
