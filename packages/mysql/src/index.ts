import mysql2 from 'mysql2/promise';
import { EndbAdapter } from 'endb';
import EndbSql from '@endb/sql';

export interface EndbMysqlOptions {
  uri: string;
  table: string;
  keySize: number;
}

export default class EndbMysql<TVal = void> extends EndbSql<TVal>
  implements EndbAdapter<TVal> {
  constructor(options: Partial<EndbMysqlOptions> = {}) {
    const { uri = 'mysql://localhost' } = options;
    super({
      dialect: 'mysql',
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
