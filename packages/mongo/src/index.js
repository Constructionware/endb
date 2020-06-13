"use strict";

const EventEmitter = require("events");
const mongodb = require("mongodb");

/**
 * EndbMongo
 * @extends EventEmitter
 */
class EndbMongo extends EventEmitter {
  /**
   * @typedef {Object} EndbMongoOptions
   * @property {string} [uri] The connection URI
   * @property {string} [collection='endb'] The collection
   */

  /**
   * Creates a new EndbMongo instance
   * @param {EndbMongoOptions} [options={}]
   */
  constructor(options = {}) {
    super();
    const { uri = "mongodb://127.0.0.1:27017", collection = "endb" } = options;
    this.db = new Promise((resolve) => {
      mongodb.MongoClient.connect(uri, (error, client) => {
        if (error !== null) {
          return this.emit("error", error);
        }

        const db = client.db();
        const coll = db.collection(collection);
        db.on("error", (error) => this.emit("error", error));
        coll.createIndex(
          { key: 1 },
          {
            unique: true,
            background: true,
          }
        );
        resolve(coll);
      });
    });
  }

  async all() {
    const collection = await this.db;
    return collection
      .find({ key: new RegExp(`^${this.namespace}:`) })
      .toArray();
  }

  async clear() {
    const collection = await this.db;
    await collection.deleteMany({ key: new RegExp(`^${this.namespace}:`) });
  }

  async delete(key) {
    const collection = await this.db;
    const { deletedCount } = await collection.deleteOne({ key });
    return deletedCount !== undefined && deletedCount > 0;
  }

  async get(key) {
    const collection = await this.db;
    const doc = await collection.findOne({ key });
    return doc === null ? undefined : doc.value;
  }

  async has(key) {
    const collection = await this.db;
    const doc = await collection.findOne({ key });
    return Boolean(doc);
  }

  async set(key, value) {
    const collection = await this.db;
    return collection.replaceOne({ key }, { key, value }, { upsert: true });
  }
}

module.exports = EndbMongo;
