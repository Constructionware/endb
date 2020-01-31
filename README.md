<div align="center">
    <a href="https://endb.js.org"><img src="docs/media/logo.png" width="300" height="220" alt="Endb" /></a>
</div>

> 🗃 Simple key-value storage with support for multiple backends.

[![Discord](https://discordapp.com/api/guilds/658014948118495243/embed.png)](https://discord.gg/nSZZ2XZ)
[![Build Status](https://travis-ci.com/chroventer/endb.svg?branch=master)](https://travis-ci.com/chroventer/endb)
[![Dependencies](https://img.shields.io/david/chroventer/endb.svg?maxAge=3600)](https://david-dm.org/chroventer/endb)
[![Downloads](https://badgen.net/npm/dt/endb)](https://www.npmjs.com/package/endb)
[![GitHub Stars](https://badgen.net/github/stars/chroventer/endb)](https://github.com/chroventer/endb)
[![License](https://badgen.net/github/license/chroventer/endb)](https://github.com/chroventer/endb/blob/master/LICENSE)

If you have any questions or experiencing problems regarding Endb, please do not hesitate to join our [official Discord](https://discord.gg/nSZZ2XZ).

## Features

- [**Easy-to-use**](#usage): *Endb* has a simplistic and easy-to-use promise-based API.
- [**Adapters**](#usage): By default, data is stored in memory. Optionally, install and utilize an "storage adapter".
- [**Third-Party Adapters**](#third-party-adapters): You can optionally utilize third-party adapters or build your own.
- [**Namespaces**](#namespaces): Namespaces isolate elements within a database to enable useful features.
- [**Custom Serializers**](#custom-serializers): Utilizes its own data serialization methods to ensure consistency across different backends.
- [**Embeddable**](#embeddable): Designed to be easily embeddable inside modules.
- **Data Types**: Handles all the JSON types including [`Buffer`](https://nodejs.org/api/buffer.html).
- **Error-Handling**: Connection errors are sent through, from the adapter to the main instance; connection errors will not exit or kill the process.

## Installation

```bash
$ npm install endb
```

By default, data is stored in memory. Optionally, install and utilize an "storage adapter". Officially supported adapters are LevelDB, MongoDB, NeDB, MySQL, PostgreSQL, Redis, and SQLite.

```bash
$ npm install level # LevelDB
$ npm install mongojs # MongoDB
$ npm install nedb # NeDB
$ npm install ioredis # Redis

# To use SQL database, an additional package 'sql' must be installed and an adapter
$ npm install sql

$ npm install mysql2 # MySQL
$ npm install pg # PostgreSQL
$ npm install sqlite3 # SQLite
```

## Usage

```javascript
const Endb = require('endb');

// One of the following
const endb = new Endb();
const endb = new Endb('leveldb://path/to/database');
const endb = new Endb('nedb://path/to/database');
const endb = new Endb('mongodb://user:pass@localhost:27017/dbname');
const endb = new Endb('mysql://user:pass@localhost:3306/dbname');
const endb = new Endb('postgresql://user:pass@localhost:5432/dbname');
const endb = new Endb('redis://user:pass@localhost:6379');
const endb = new Endb('sqlite://path/to/database.sqlite');

// Handles connection errors
endb.on('error', err => console.log('Connection Error: ', err));

await endb.set('foo', 'bar'); // true
await endb.get('foo'); // 'bar'
await endb.all(); // [ ... ]
await endb.has('foo'); // true
await endb.delete('foo'); // true
await endb.clear(); // undefined
```

## Namespaces

Namespaces isolate elements within a database, avoid key collisions, separate elements by prefixing the keys, and allow clearance of only one namespace while utilizing the same database.

```javascript
const users = new Endb({ namespace: 'users' });
const members = new Endb({ namespace: 'members' });

await users.set('foo', 'users'); // true
await members.set('foo', 'members'); // true
await users.get('foo'); // 'users'
await members.get('foo'); // 'members'
await users.clear(); // undefined
await users.get('foo'); // undefined
await members.get('foo'); // 'members'
```

## Third-Party Adapters

You can optionally utilize third-party adapters or build your own. *Endb* will integrate the third-party adapter and handle complex data types internally.

```javascript
const myAdapter = require('./my-adapter');
const endb = new Endb({ store: myAdapter });
```

For example, [`quick-lru`](https://github.com/sindresorhus/quick-lru) is an unrelated module that implements the Map API.

```javascript
const Endb = require('endb');
const QuickLRU = require('quick-lru');

const lru = new QuickLRU({ maxSize: 1000 });
const endb = new Endb({ store: lru });
```

## Custom Serializers

Endb utilizes its own data serialization methods that encode Buffer data as a base64-encoded string, and decode JSON objects which contain buffer-like data (either as arrays of numbers or strings) into Buffer instances to ensure consistency across different backends.

*Endb* handles all the JSON data types including [`Buffer`](https://nodejs.org/api/buffer.html) using its data serialization methods.
Optionally, pass your own data serialization methods to support extra data types.

```javascript
const endb = new Endb({
    serialize: JSON.stringify,
    deserialize: JSON.parse
});
```

**Warning**: Using custom serializers means you lose any guarantee of data consistency.

## Embeddable

*Endb* is designed to be easily embeddable inside modules. It is recommended to set a [namespace](#namespaces) for the module.

```javascript
class MyModule {
    constructor(options) {
        this.db = new Endb({
            uri: typeof options.store === 'string' && options.store,
            store: typeof options.store !== && options.store,
            namespace: 'my-module'
        });
    }
}
```

Now the module can be used like this:

```javascript
const MyModule = require('my-module');

// Caches data in the memory by default.
const myModule = new MyModule();

// After installing ioredis.
const myModule = new MyModule({ store: 'redis://localhost' });

// Third-party module that implements the Map API.
const myModule = new AwesomeModule({ store: thirdPartyModule });
```

## Links

- [Documentation](https://endb.js.org "Documentation")
- [Discord](https://discord.gg/nSZZ2XZ "Discord")
- [GitHub](https://github.com/chroventer/endb "GitHub")
- [NPM](https://npmjs.com/package/endb "NPM")
