'use strict';

const { Pool } = require('pg');
const EndbSql = require('@endb/sql');

module.exports = class EndbPostgres extends EndbSql {
  constructor(options = {}) {
    options = {
      uri: 'postgresql://localhost:5432',
      ...(typeof options === 'string' ? { uri: options } : options),
    };
    super({
      dialect: 'postgres',
      async connect() {
        const pool = new Pool({ connectionString: options.uri });
        return Promise.resolve(async (sqlString) => {
          const { rows } = await pool.query(sqlString);
          return rows;
        });
      },
      ...options,
    });
  }
};
