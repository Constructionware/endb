# `@endb/mysql`

> MySQL/MariaDB adapter for Endb

## Installation

```shell
npm install @endb/mysql
```

## Usage

```javascript
const Endb = require('endb');
const EndbMysql = require('@endb/mysql');

const store = new EndbMysql({ uri: 'mysql://user:pass@localhost:3306/dbname', table: 'cache' });
const endb = new Endb({ store });
```
