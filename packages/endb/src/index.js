'use strict';

const EventEmitter = require('events');
const BJSON = require('buffer-json');
const _get = require('lodash/get');
const _has = require('lodash/has');
const _set = require('lodash/set');
const _unset = require('lodash/unset');

const load = (options) => {
  const adapters = {
    mongo: '@endb/mongo',
    mongodb: '@endb/mongo',
    mysql: '@endb/mysql',
    postgres: '@endb/postgres',
    postgresql: '@endb/postgres',
    redis: '@endb/redis',
    sqlite: '@endb/sqlite',
  };
  if (options.adapter || options.uri) {
    const adapter = options.adapter || /^[^:]*/.exec(options.uri)[0];
    const Adapter = require(adapters[adapter]);
    return new Adapter(options);
  }

  return new Map();
};

class Endb extends EventEmitter {
  constructor(options = {}) {
    super();
    this.options = {
      namespace: 'endb',
      serialize: BJSON.stringify,
      deserialize: BJSON.parse,
      ...(typeof options === 'string' ? { uri: options } : options),
    };

    if (!this.options.store) {
      this.options.store = load(this.options);
    }

    if (typeof this.options.store.on === 'function') {
      this.options.store.on('error', (error) => this.emit('error', error));
    }

    this.options.store.namespace = this.options.namespace;
  }

  async all() {
    const { store, deserialize } = this.options;
    if (store instanceof Map) {
      const elements = [];
      for (const [key, value] of store) {
        elements.push({
          key: this._removeKeyPrefix(key),
          value: typeof value === 'string' ? deserialize(value) : value,
        });
      }

      return elements;
    }

    const elements = [];
    const data = await store.all();
    for (const { key, value } of data) {
      elements.push({
        key: this._removeKeyPrefix(key),
        value: typeof value === 'string' ? deserialize(value) : value,
      });
    }

    return elements;
  }

  async clear() {
    const { store } = this.options;
    return store.clear();
  }

  async delete(key, path = null) {
    if (path !== null) {
      const data = (await this.get(key)) || {};
      _unset(data, path);
      const result = await this.set(key, data);
      return result;
    }

    const { store } = this.options;
    const keyPrefixed = this._addKeyPrefix(key);
    return store.delete(keyPrefixed);
  }

  async entries() {
    const elements = await this.all();
    return elements.map((element) => [element.key, element.value]);
  }

  async get(key, path = null) {
    const keyPrefixed = this._addKeyPrefix(key);
    const { store, deserialize } = this.options;
    const serialized = await store.get(keyPrefixed);
    const deserialized =
      typeof serialized === 'string' ? deserialize(serialized) : serialized;
    if (deserialized === undefined) return undefined;
    if (path !== null) return _get(deserialized, path);
    return deserialized;
  }

  async has(key, path = null) {
    if (path !== null) {
      const data = (await this.get(key)) || {};
      return _has(data, path);
    }

    const { store } = this.options;
    key = this._addKeyPrefix(key);
    const exists = await store.has(key);
    return exists;
  }

  async keys() {
    const elements = await this.all();
    return elements.map((element) => element.key);
  }

  async set(key, value, path = null) {
    const { store, serialize } = this.options;
    if (path !== null) {
      const data = (await this.get(key)) || {};
      value = _set(data, path, value);
    }

    const keyPrefixed = this._addKeyPrefix(key);
    const serialized = serialize(value);
    await store.set(keyPrefixed, serialized);
    return true;
  }

  async values() {
    const elements = await this.all();
    return elements.map((element) => element.value);
  }

  _addKeyPrefix(key) {
    const { namespace } = this.options;
    return `${namespace}:${key}`;
  }

  _removeKeyPrefix(key) {
    const { namespace } = this.options;
    return key.replace(`${namespace}:`, '');
  }
}

module.exports = Endb;
