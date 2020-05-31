'use strict';

const Endb = require('endb');
const EndbRedis = require('../src');
const { endbTest, adapterTest } = require('@endb/test');
const { REDIS_HOST = 'localhost' } = process.env;
const uri = `redis://${REDIS_HOST}`;

adapterTest(test, Endb, uri, 'redis://foo');
endbTest(test, Endb, {
    store: new EndbRedis({ uri })
});
