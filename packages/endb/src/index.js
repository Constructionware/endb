"use strict";

const EventEmitter = require("events");
const BJSON = require("buffer-json");
const _get = require("lodash/get");
const _has = require("lodash/has");
const _set = require("lodash/set");
const _unset = require("lodash/unset");

const load = (options) => {
  const adapters = {
    mongo: "@endb/mongo",
    mongodb: "@endb/mongo",
    mysql: "@endb/mysql",
    postgres: "@endb/postgres",
    postgresql: "@endb/postgres",
    redis: "@endb/redis",
    sqlite: "@endb/sqlite",
  };
  if (options.adapter || options.uri) {
    const adapter = options.adapter || /^[^:]*/.exec(options.uri)[0];
    const Adapter = require(adapters[adapter]);
    return new Adapter(options);
  }

  return new Map();
};

/**
 * Endb
 * @extends EventEmitter
 */
class Endb extends EventEmitter {
  /**
   * @typedef {Object} EndbOptions
   * @memberof Endb
   * @property {string} [uri] The connection URI
   * @property {string} [namespace='endb'] The namespace for database
   * @property {Function} [serialize] The custom serialize function
   * @property {Function} [deserialize] The custom deserialize function
   * @property {*} [store=Map] The storage adapter
   */

  /**
   * Creates a new Endb instance
   * @param {string|EndbOptions} [options={}]
   */
  constructor(options = {}) {
    super();

    /**
     * The options for Endb
     * @type {EndbOptions}
     */
    this.options = {
      namespace: "endb",
      serialize: BJSON.stringify,
      deserialize: BJSON.parse,
      ...(typeof options === "string" ? { uri: options } : options),
    };

    if (!this.options.store) {
      this.options.store = load(this.options);
    }

    if (typeof this.options.store.on === "function") {
      this.options.store.on("error", (error) => this.emit("error", error));
    }

    this.options.store.namespace = this.options.namespace;
  }

  /**
   * Gets all the elements from the database
   * @return {Promise<any[]>} An array containing all the elements
   */
  async all() {
    const { store, deserialize } = this.options;
    if (store instanceof Map) {
      const elements = [];
      for (const [key, value] of store) {
        elements.push({
          key: this._removeKeyPrefix(key),
          value: typeof value === "string" ? deserialize(value) : value,
        });
      }

      return elements;
    }

    const elements = [];
    const data = await store.all();
    for (const { key, value } of data) {
      elements.push({
        key: this._removeKeyPrefix(key),
        value: typeof value === "string" ? deserialize(value) : value,
      });
    }

    return elements;
  }

  /**
   * Clears all elements from the database
   * @return {Promise<void>}
   */
  async clear() {
    const { store } = this.options;
    return store.clear();
  }

  /**
   * Deletes an element from the database by key
   * @param {string} key The key of the element to remove from the database
   * @param {string} [path] The path of the property to remove from the value
   * @return {Promise<boolean>} `true` if the element is deleted successfully, otherwise `false`
   */
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

  /**
   * Returns an array that contains the keys and values of every element
   * @return {Promise<Array<Array<string, any>>>}
   */
  async entries() {
    const elements = await this.all();
    return elements.map((element) => [element.key, element.value]);
  }

  /**
   * Gets the value of an element from the database by key
   * @param {string} key The key of the element to get
   * @param {string} [path] The path of the property to get from the value
   * @return {Promise<*|void>} The value of the element, or `undefined` if the element is not found in the database
   */
  async get(key, path = null) {
    const keyPrefixed = this._addKeyPrefix(key);
    const { store, deserialize } = this.options;
    const serialized = await store.get(keyPrefixed);
    const deserialized =
      typeof serialized === "string" ? deserialize(serialized) : serialized;
    if (deserialized === undefined) {
      return undefined;
    }

    if (path !== null) {
      return _get(deserialized, path);
    }

    return deserialized;
  }

  /**
   * Checks whether an element exists in the database or not
   * @param {string} key The key of an element to check for
   * @param {?string} [path] The path of the property to check for
   * @return {Promise<boolean>} `true` if the element exists in the database, otherwise `false`
   */
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

  /**
   * Returns an array that contains the keys of every element
   * @return {Promise<string[]>}
   */
  async keys() {
    const elements = await this.all();
    return elements.map((element) => element.key);
  }

  /**
   * Sets an element to the database.
   * @param {string} key The key of the element to set to the database.
   * @param {*} value The value of the element to set to the database.
   * @param {string} [path] The path of the property to set in the value.
   * @return {Promise<boolean>}
   */
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

  /**
   * Returns an array that contains the values of every element
   * @return {Promise<any[]>} An array containing all the values of elements
   */
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
    return key.replace(`${namespace}:`, "");
  }
}

module.exports = Endb;
