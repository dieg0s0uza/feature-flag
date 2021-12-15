import { IDataProvider } from '.';
import { DataModel } from '../models';
import { Connection } from 'mysql2';

const DEFAULT_TABLE = 'features';

interface Options {
    /** Table name of data. Default: 'features' */
    tableName?: string,
    /** A instance of mysql connection */
    connection: Connection
}

export class MysqlDataProvider implements IDataProvider {
    private connection: Connection;
    private tableName: string;

    constructor(options: Options) {
        this.connection = options.connection;
        this.tableName = options.tableName || DEFAULT_TABLE;
    }

    async getAll(): Promise<DataModel[]> {
        return new Promise((resolve, reject) => {
            this.connection.query('SELECT * FROM ??', [this.tableName], (err, results: any[]) => {
                if (err) return reject(err);
                resolve(results as DataModel[]);
            });
        });
    }

    async get(key: string): Promise<DataModel | undefined> {
        return new Promise((resolve, reject) => {
            this.connection.query('SELECT * FROM ?? WHERE `key` = ?', [this.tableName, key], (err, results: any[]) => {
                if (err) return reject(err);
                resolve(results.length ? results[0] as DataModel : undefined);
            });
        });
    }
}