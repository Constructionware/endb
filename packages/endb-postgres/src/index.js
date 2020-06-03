'use strict';

const { Pool } = require('pg');
const EndbSql = require('@endb/sql');

module.exports = class EndbPostgres extends EndbSql {
  constructor(options = {}) {
    const { uri = 'postgresql://localhost:5432' } = options;
    super({
      dialect: 'postgres',
      async connect() {
        return Promise.resolve(async (sqlString) => {
          const pool = new Pool({ connectionString: uri });
          const { rows } = await pool.query(sqlString);
          return rows;
        });
      },
      ...options,
    });
  }
};
