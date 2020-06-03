'use strict';

const Endb = require('endb');
const EndbMongo = require('../src');
const { apiTest, adapterTest } = require('@endb/test');
const { MONGO_HOST = '127.0.0.1', MONGO_PORT = 27017 } = process.env;
const uri = `mongodb://${MONGO_HOST}:${MONGO_PORT}?useUnifiedTopology=true`;
const store = new EndbMongo({ uri });

adapterTest(test, Endb, uri, 'mongodb://127.0.0.1:1234');
apiTest(test, Endb, { store });
