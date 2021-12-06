import { IDataProvider } from '../providers/IDataProvider';
import { DataModel } from '../models/DataModel';
import { DataValueType } from '../types';
import fs from 'fs';

interface KeyValue {
    [key: string]: DataValueType;
};

interface Options {
    data?: KeyValue,
    file?: string
};

export class JsonDataProvider implements IDataProvider {
    private data?: KeyValue;

    constructor(options: Options) {
        if (options.file) {
            this.loadFromFile(options.file);
        } else {
            this.data = options.data;
        }
    }

    private loadFromFile(file?: string) {
        if (file) {
            const rawdata = fs.readFileSync(file);
            this.data = JSON.parse(rawdata.toString());
        }
    }

    async getAll(): Promise<DataModel[]> {
        if (!this.data) return [];
        const jsonKeys = Object.keys(this.data);
        return jsonKeys.map(a => ({
            key: a,
            value: this.data![a]
        }));
    }

    async get(key: string): Promise<DataModel | undefined> {
        if (!this.data) return undefined;
        const value = this.data[key];
        return { key, value };
    }
}