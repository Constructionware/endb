import { EventEmitter } from "events";
import BJSON from "buffer-json";
import _get from "lodash/get";
import _has from "lodash/has";
import _set from "lodash/set";
import _unset from "lodash/unset";

const adapters = {
  mongo: "./adapters/mongodb",
  mongodb: "./adapters/mongodb",
  mysql: "./adapters/mysql",
  postgres: "./adapters/postgres",
  postgresql: "./adapters/postgres",
  redis: "./adapters/redis",
  sqlite: "./adapters/sqlite",
};

const load = <TVal>(options: Partial<EndbOptions<TVal>>): EndbAdapter<TVal> => {
  const validAdapters = Object.keys(adapters);
  let adapter: undefined | keyof typeof adapters;
  if (options.adapter) {
    adapter = options.adapter;
  } else if (options.uri) {
    const matches = /^[^:]+/.exec(options.uri);
    if (matches === null) {
      throw new Error(`[endb]: could not infer adapter from "${options.uri}"`);
    }

    adapter = matches[0] as keyof typeof adapters;
  }

  if (!adapter) {
    return new Map() as Map<string, string> & { namespace: string };
  }

  if (validAdapters.includes(adapter)) {
    const Adapter = require(adapters[adapter]).default;
    return new Adapter(options);
  }

  throw new Error(`[endb]: invalid adapter "${adapter}"`);
};

export class Endb<TVal> extends EventEmitter {
  protected readonly options: EndbOptions<TVal>;
  constructor(options: string | Partial<EndbOptions<TVal>> = {}) {
    super();
    const adapterOptions = {
      namespace: "endb",
      serialize: BJSON.stringify,
      deserialize: BJSON.parse,
      ...(typeof options === "string" ? { uri: options } : options),
    };

    this.options = {
      store: adapterOptions.store ?? load(adapterOptions),
      ...adapterOptions,
    };

    if (typeof this.options.store.on === "function") {
      this.options.store.on("error", (error) => this.emit("error", error));
    }

    this.options.store.namespace = this.options.namespace;
  }

  public async all(): Promise<Element<TVal>[]> {
    const { store, deserialize } = this.options;
    if (store instanceof Map) {
      const elements = [];
      for (const [key, value] of store) {
        elements.push({
          key: this.removeKeyPrefix(key),
          value: typeof value === "string" ? deserialize(value) : value,
        });
      }

      return elements;
    }

    const data = await store.all!();
    const elements = [];
    for (const { key, value } of data) {
      elements.push({
        key: this.removeKeyPrefix(key),
        value: typeof value === "string" ? deserialize(value) : value,
      });
    }

    return elements;
  }

  public async clear(): Promise<void> {
    const { store } = this.options;
    return store.clear();
  }

  public async delete(key: string, path?: string): Promise<boolean> {
    if (typeof path !== "undefined") {
      const value = await this.get(key);
      _unset(value || {}, path);
      return await this.set(key, value);
    }

    const { store } = this.options;
    const keyPrefixed = this.addKeyPrefix(key);
    return store.delete(keyPrefixed);
  }

  public async entries(): Promise<[string, TVal][]> {
    const elements = await this.all();
    return elements.map((element) => [element.key, element.value]);
  }

  public async get(key: string, path?: string): Promise<void | TVal | any> {
    const { store, deserialize } = this.options;
    const keyPrefixed = this.addKeyPrefix(key);
    const value = await store.get(keyPrefixed);
    const deserialized = typeof value === "string" ? deserialize(value) : value;
    if (deserialized === undefined) return undefined;
    if (typeof path !== "undefined") return _get(deserialized, path);
    return deserialized;
  }

  public async has(key: string, path?: string): Promise<boolean> {
    if (typeof path !== "undefined") {
      const value = await this.get(key);
      return _has(value || {}, path);
    }

    const { store } = this.options;
    const keyPrefixed = this.addKeyPrefix(key);
    const exists = await store.has(keyPrefixed);
    return exists;
  }

  public async keys(): Promise<string[]> {
    const elements = await this.all();
    return elements.map((element) => element.key);
  }

  public async set(key: string, value: any, path?: string): Promise<boolean> {
    const { store, serialize } = this.options;
    let propValue: any = value;
    if (typeof path !== "undefined") {
      const val = await this.get(key);
      propValue = _set(val || {}, path, value);
    }

    const keyPrefixed = this.addKeyPrefix(key);
    const serialized = serialize(propValue);
    await store.set(keyPrefixed, serialized);
    return true;
  }

  public async values(): Promise<TVal[]> {
    const elements = await this.all();
    return elements.map((element) => element.value);
  }

  private addKeyPrefix(key: string): string {
    const { namespace } = this.options;
    return `${namespace}:${key}`;
  }

  private removeKeyPrefix(key: string): string {
    const { namespace } = this.options;
    return key.replace(`${namespace}:`, "");
  }
}

type MaybePromise<T> = T | Promise<T>;

export interface EndbOptions<TVal, TSerialized = string> {
  uri?: string;
  adapter?: keyof typeof adapters;
  namespace: string;
  serialize(data: TVal): TSerialized;
  deserialize(data: TSerialized): TVal;
  store: EndbAdapter<TVal, TSerialized>;
}

export interface EndbAdapter<TVal, TSerialized = string> {
  namespace: string;
  on?(event: "error", callback: (error: Error) => void | never): void;
  all?(): MaybePromise<Element<TSerialized>[]>;
  clear(): MaybePromise<void>;
  delete(key: string): MaybePromise<boolean>;
  get(key: string): MaybePromise<void | TVal | TSerialized>;
  has(key: string): MaybePromise<boolean>;
  set(key: string, value: TSerialized): MaybePromise<unknown>;
}

export interface Element<T> {
  key: string;
  value: T;
}
