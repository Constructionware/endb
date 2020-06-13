# `endb`

> Key-value storage with support for multiple databases

## Usage

```javascript
const Endb = require('endb');

const endb = new Endb();
const endb = new Endb({
    store: new Map(),
    namespace: 'cache'
});
```
