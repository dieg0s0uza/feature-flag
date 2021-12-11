import { IDataProvider } from './';
import { DataModel } from '../models';
import * as mongoDB from "mongodb";

const DEFAULT_COLLECTION = 'features';

interface Options {
    /** Collection name of data. Default: 'features' */
    collectionName?: string,
    /** A instance of mongodb */
    db: mongoDB.Db
}

export class MongodbDataProvider implements IDataProvider {
    private db: mongoDB.Db;
    private collection: mongoDB.Collection<DataModel>;

    constructor(options: Options) {
        this.db = options.db;
        this.collection = this.db.collection<DataModel>(options.collectionName || DEFAULT_COLLECTION);
    }

    async getAll(): Promise<DataModel[]> {
        const dataResult = await this.collection.find({}, { projection: { _id: 0 } }).toArray();
        return dataResult as DataModel[];
    }

    async get(key: string): Promise<DataModel | undefined> {
        const dataResult = await this.collection.findOne({ key }, { projection: { _id: 0 } });
        if (!dataResult) return undefined;
        return dataResult as DataModel;
    }
}