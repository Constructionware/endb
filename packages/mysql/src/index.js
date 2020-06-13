"use strict";

const mysql2 = require("mysql2/promise");
const EndbSql = require("@endb/sql");

/**
 * EndbSql
 * @extends EndbSql
 */
class EndbMysql extends EndbSql {
  /**
   * @typedef {Object} EndbMysqlOptions
   * @property {string} [uri] The connection URI
   * @property {string} [table='endb'] The table
   */

  /**
   * Creates a new EndbSql instance
   * @param {EndbMysqlOptions} [options={}]
   */
  constructor(options = {}) {
    const { uri = "mysql://localhost" } = options;
    super({
      dialect: "mysql",
      async connect() {
        const connection = await mysql2.createConnection(uri);
        return async (sqlString) => {
          const [row] = await connection.execute(sqlString);
          return row;
        };
      },
      ...options,
    });
  }
}

module.exports = EndbMysql;
