'use strict';

const apiTest = (test, Endb, options = {}) => {
  describe('API Test', () => {
    beforeEach(async () => {
      const endb = new Endb(options);
      await endb.clear();
    });

    test('All methods return a Promise.', () => {
      const endb = new Endb(options);
      expect(endb.all()).toBeInstanceOf(Promise);
      expect(endb.clear()).toBeInstanceOf(Promise);
      expect(endb.delete('foo')).toBeInstanceOf(Promise);
      expect(endb.entries()).toBeInstanceOf(Promise);
      expect(endb.get('foo')).toBeInstanceOf(Promise);
      expect(endb.has('foo')).toBeInstanceOf(Promise);
      expect(endb.keys()).toBeInstanceOf(Promise);
      expect(endb.set('foo', 'bar')).toBeInstanceOf(Promise);
      expect(endb.values() instanceof Promise);
    });

    test('.all() resolves to an array containing all the keys and values', async () => {
      const endb = new Endb(options);
      await endb.set('foo', 'bar');
      expect(await endb.all()).toContainEqual({ key: 'foo', value: 'bar' });
    });

    test('.clear() resolves to undefined', async () => {
      const endb = new Endb(options);
      expect(await endb.clear()).toBeUndefined();
      await endb.set('foo', 'bar');
      expect(await endb.clear()).toBeUndefined();
    });

    test('.delete(key) resolves to true', async () => {
      const endb = new Endb(options);
      await endb.set('foo', 'bar');
      expect(await endb.delete('foo')).toBe(true);
    });

    test('.delete(key) with non-existent key resolves to false', async () => {
      const endb = new Endb(options);
      expect(await endb.delete('foo')).toBe(false);
    });

    test('.delete(key, path) deletes the property of the value', async () => {
      const endb = new Endb(options);
      const path = 'fizz.buzz';
      await endb.set('foo', 'bar', path);
      expect(await endb.delete('foo', path)).toBe(true);
    });

    test('.find(fn) resolves to value', async () => {
      const endb = new Endb(options);
      await endb.set('foo', 'bar');
      expect(await endb.find((value) => value === 'bar')).toBe('bar');
    });

    test('.find(fn) with non-existent value resolves to undefined', async () => {
      const endb = new Endb(options);
      expect(await endb.find((value) => value === 'bar')).toBeUndefined();
    });

    test('.get(key) resolves to value', async () => {
      const endb = new Endb(options);
      await endb.set('foo', 'bar');
      expect(await endb.get('foo')).toBe('bar');
    });

    test('.get(key) with non-existent key resolves to undefined', async () => {
      const endb = new Endb(options);
      expect(await endb.get('foo')).toBeUndefined();
    });

    test('.get(key, path) gets the property of the value', async () => {
      const endb = new Endb(options);
      const path = 'fizz.buzz';
      await endb.set('foo', 'bar', path);
      expect(await endb.get('foo', path)).toBe('bar');
    });

    test('.has(key) resolves to a true', async () => {
      const endb = new Endb(options);
      await endb.set('foo', 'bar');
      expect(await endb.has('foo')).toBe(true);
    });

    test('.has(key) with non-existent key resolves to false', async () => {
      const endb = new Endb(options);
      expect(await endb.has('foo')).toBe(false);
    });

    test('.has(key, path) checks whether the property exists or not', async () => {
      const endb = new Endb(options);
      const path = 'fizz.buzz';
      await endb.set('foo', 'bar', path);
      expect(await endb.has('foo', path)).toBe(true);
    });

    test('.set(key, value) resolves to true', async () => {
      const endb = new Endb(options);
      expect(await endb.set('foo', 'bar')).toBe(true);
    });

    test('.set(key, value) sets a value', async () => {
      const endb = new Endb(options);
      await endb.set('foo', 'bar');
      expect(await endb.get('foo')).toBe('bar');
    });

    test('.set(key, value, path) sets the property to the value', async () => {
      const endb = new Endb(options);
      const path = 'fizz.buzz';
      await endb.set('foo', 'bar', path);
      expect(await endb.get('foo')).toEqual({ fizz: { buzz: 'bar' } });
    });

    afterEach(async () => {
      const endb = new Endb(options);
      await endb.clear();
    });
  });
};

const adapterTest = (it, Endb, goodUri, badUri) => {
  describe('Adapter Test', () => {
    it('should infer the adapter from the URI', async () => {
      const endb = new Endb(goodUri);
      await endb.clear();
      expect(await endb.get('foo')).toBeUndefined();
      await endb.set('foo', 'bar');
      expect(await endb.get('foo')).toBe('bar');
      await endb.clear();
    });

    it('should emit connection errors', (done) => {
      const endb = new Endb(badUri);
      endb.on('error', () => done());
    });
  });
};

const endbTest = (test, Endb, options = {}) => {
  apiTest(test, Endb, options);
};

module.exports = { endbTest, apiTest, adapterTest };
