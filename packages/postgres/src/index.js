"use strict";

const pg = require("pg");
const EndbSql = require("@endb/sql");

/**
 * @extends EndbSql
 */
class EndbPostgres extends EndbSql {
  /**
   * @typedef {Object} EndbPostgres
   * @property {string} [uri] The connection URI
   * @property {string} [table='endb'] The table
   */

  /**
   * Creates a new EndbPostgres instance
   * @param {EndbPostgresOptions} [options={}]
   */
  constructor(options = {}) {
    const { uri = "postgresql://localhost:5432" } = options;
    super({
      dialect: "postgres",
      async connect() {
        const pool = new pg.Pool({ connectionString: uri });
        return Promise.resolve(async (sqlString) => {
          const { rows } = await pool.query(sqlString);
          return rows;
        });
      },
      ...options,
    });
  }
}

module.exports = EndbPostgres;
