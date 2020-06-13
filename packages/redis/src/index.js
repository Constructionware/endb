"use strict";

const EventEmitter = require("events");
const util = require("util");
const Redis = require("redis");

/**
 * @extends EventEmitter
 */
class EndbRedis extends EventEmitter {
  /**
   * @typedef EndbRedisOptions
   * @property {string} [uri] The connection URI
   * @link https://www.npmjs.com/package/redis#options-object-properties
   */

  /**
   * Creates a new EndbRedis instance
   * @param {EndbRedisOptions} [options={}]
   */
  constructor(options = {}) {
    super();
    if (options.uri && typeof options.url === "undefined") {
      options.url = options.uri;
    }

    const client = Redis.createClient(options);
    this.db = [
      "get",
      "set",
      "sadd",
      "del",
      "exists",
      "srem",
      "keys",
      "smembers",
    ].reduce((object, method) => {
      const fn = client[method];
      object[method] = util.promisify(fn.bind(client));
      return object;
    }, {});
    client.on("error", (error) => this.emit("error", error));
  }

  async all() {
    const keys = await this.db.keys(`${this.namespace}*`);
    const elements = [];
    for (const key of keys) {
      const value = await this.db.get(key);
      elements.push({ key, value });
    }

    return elements;
  }

  async clear() {
    const namespace = this._prefixNamespace();
    const keys = await this.db.smembers(namespace);
    await this.db.del(...keys.concat(namespace));
  }

  async delete(key) {
    const items = await this.db.del(key);
    await this.db.srem(this._prefixNamespace(), key);
    return items > 0;
  }

  async get(key) {
    const value = await this.db.get(key);
    if (value === null) {
      return;
    }

    return value;
  }

  async has(key) {
    const exists = await this.db.exists(key);
    return Boolean(exists);
  }

  async set(key, value) {
    await this.db.set(key, value);
    return this.db.sadd(this._prefixNamespace(), key);
  }

  _prefixNamespace() {
    return `namespace:${this.namespace}`;
  }
}

module.exports = EndbRedis;
