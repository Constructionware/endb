# [Endb](https://endb.js.org) &middot; [![Test](https://github.com/chroventer/endb/workflows/Test/badge.svg)](https://github.com/chroventer/endb) [![codecov](https://codecov.io/gh/chroventer/endb/branch/master/graph/badge.svg)](https://codecov.io/gh/chroventer/endb) [![License](https://badgen.net/github/license/chroventer/endb)](https://github.com/chroventer/endb/blob/master/LICENSE) [![Discord](https://discordapp.com/api/guilds/697425515363172362/embed.png)](https://discord.gg/d5SYmjj)
> Key-value storage for multiple databases

- **Easy-to-use**: Endb has a simplistic and neat promise-based API.
- **Adapters**: By default, data is cached in memory. The officially supported adapters are covered by many tests to guarantee consistent behavior. They are lightweight, efficient wrappers over various database drivers. Offcially supported adapters are MongoDB, MySQL, PostgreSQL, Redis, and SQLite.
- **Third-Party Adapters**: You can optionally use a third-party storage adapters to enable desired functionality.
- **Namespaces**: Namespaces isolate elements within the database to avoid key collisions, separate elements by prefixing the keys, and allow clearance of only one namespace while utilizing the same database.
- **Custom Serializers**: Endb handles all the JSON data types including Buffer using [`buffer-json`](https://github.com/jprichardson/buffer-json). Optionally, pass your own data serialization methods to support extra data types.
- **Embeddable**: Endb is designed to be easily embeddable inside other modules with minimal efforts.
- **Data Types**: Handles all the JSON types including [`Buffer`](https://nodejs.org/api/buffer.html).
- **Error-Handling**: Database errors are transmitted through; consequently, database errors do not exit or kill the process.

## Installation

**Node.js 12.x or newer is required.**

```shell
npm install endb
```

By default, data is stored/cached in memory. Optionally, you can install and use an adapter. Officially supported database adapters are MongoDB, Redis, MySQL, PostgreSQL, and SQLite.

```shell
npm install @endb/mongo # For MongoDB
npm install @endb/mysql # For MySQL
npm install @endb/postgres # For PostgreSQL
npm install @endb/redis # For Redis
npm install @endb/sqlite # For SQLite
```

## Usage

```javascript
const Endb = require('endb');

// One of the following
const endb = new Endb('mongodb://user:pass@localhost:27017/dbname');
const endb = new Endb('mysql://user:pass@localhost:3306/dbname');
const endb = new Endb('postgresql://user:pass@localhost:5432/dbname');
const endb = new Endb('redis://user:pass@localhost:6379');
const endb = new Endb('sqlite://path/to/database.sqlite');


await endb.set('foo', 'bar'); // true
await endb.get('foo'); // 'bar'
await endb.has('foo'); // true
await endb.all(); // [ { key: 'foo', value: 'bar' } ]
await endb.delete('foo'); // true
await endb.clear(); // undefined
```

## Links

- [Website](https://endb.js.org)
- [API Reference](https://endb.js.org/api)
- [Discord](https://discord.com/invite/d5SYmjj)
- [GitHub](https://github.com/chroventer/endb)
- [NPM](https://npmjs.com/endb)
