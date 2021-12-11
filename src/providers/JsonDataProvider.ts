import { IDataProvider } from '../providers';
import { DataModel } from '../models';
import fs from 'fs';

interface KeyValue {
    [key: string]: any;
};

interface Options {
    /** Accept a object json data like key: value or a array with DataModel item */
    data?: KeyValue | DataModel[],
    /** A filename of json with key: value or a array with DataModel item */
    file?: string
};

export class JsonDataProvider implements IDataProvider {
    private data: KeyValue | DataModel[] = {};

    constructor(options: Options) {
        if (options.file) {
            this.loadFromFile(options.file);
        } else if (options.data) {
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
        if (this.data) {
            if (this.data instanceof Array) {
                return this.data;
            } else {
                const keys = Object.keys(this.data);
                return keys.map(key => ({ key, value: (this.data as KeyValue)[key] }))
            }
        }
        return [];
    }

    async get(key: string): Promise<DataModel | undefined> {
        if (this.data) {
            if (this.data instanceof Array) {
                const data = (this.data as DataModel[]).find(a => a.key === key);
                if (data) {
                    return data;
                }
            } else {
                const objValue = (this.data as KeyValue)[key];
                if (objValue !== undefined) {
                    return { key, value: objValue };
                }
            }
        }
        return undefined;
    }
}