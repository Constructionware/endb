'use strict';

const Endb = require('endb');
const EndbMongo = require('../src');
const { endbTest, adapterTest } = require('@endb/test');
const { MONGO_HOST = '127.0.0.1', MONGO_PORT = 27017 } = process.env;
const uri = `mongodb://${MONGO_HOST}:${MONGO_PORT}?useUnifiedTopology=true`;

adapterTest(test, Endb, uri, 'mongodb://127.0.0.1:1234');
endbTest(test, Endb, {
    store: new EndbMongo({ uri })
});
