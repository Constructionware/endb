# `@endb/postgres`

> PostgreSQL adapter for Endb

## Installation

```shell
npm install @endb/postgres
```

## Usage

```javascript
const Endb = require('endb');
const EndbPostgres = require('@endb/postgres');

const store = new EndbPostgres({ uri: 'postgresql://user:pass@localhost:5432/dbname', table: 'cache' });
const endb = new Endb({ store });
```
