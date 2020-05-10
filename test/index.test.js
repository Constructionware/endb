'use strict';

const Endb = require('../src');
const { endbTest } = require('./functions');

describe('Core', () => {
  it('should be a class', () => {
    expect(typeof Endb).toBe('function');
    expect(() => new Endb()).not.toThrow();
  });

  it('should integrate the adapter provided', async () => {
    const store = new Map();
    const endb = new Endb({ store });
    expect(store.size).toBe(0);
    await endb.set('foo', 'bar');
    expect(await endb.get('foo')).toBe('bar');
    expect(store.size).toBe(1);
  });
  
  it('should integrate custom serializers provided', async () => {
    const store = new Map();
    const serialize = JSON.stringify;
    const deserialize = JSON.parse;
    const endb = new Endb({
        store,
        serialize,
        deserialize
    });
    expect(await endb.set('foo', 'bar')).toBe(true);
    expect(await endb.get('foo')).toBe('bar');
  });
});

endbTest(test, Endb, {
    store: new Map()
});