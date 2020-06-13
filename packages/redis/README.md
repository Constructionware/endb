# `@endb/redis`

> Redis adapter for Endb

## Installation

```shell
npm install @endb/redis
```

## Usage

```javascript
const Endb = require('endb');
const EndbRedis = require('@endb/redis');

const store = new EndbRedis({ uri: 'redis://user:pass@localhost:6379' });
const endb = new Endb({ store });
```
