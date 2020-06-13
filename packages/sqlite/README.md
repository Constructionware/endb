# `@endb/sqlite`

> SQLite adapter for Endb

## Installation

```shell
npm install @endb/sqlite
```

## Usage

```javascript
const Endb = require('endb');
const EndbSqlite = require('@endb/sqlite');

const store = new EndbSqlite({ uri: 'sqlite://path/to/database.sqlite', table: 'cache' });
const endb = new Endb({ store });
```
