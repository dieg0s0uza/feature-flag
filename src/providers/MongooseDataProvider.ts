import { Schema, model, Model, Connection } from 'mongoose';
import { IDataProvider } from '../providers';
import { DataModel } from '../models';

const DEFAULT_COLLECTION = 'features';

const schema = new Schema<DataModel>({
    key: { type: String, required: true, index: true },
    value: { type: Schema.Types.Mixed },
    description: String
});

interface Options {
    /** Collection name of data. Default: 'features' */
    collectionName?: string,
    /** A instance of mongoose connection. Default: global mongoose instance */
    connection?: Connection
}

export class MongooseDataProvider implements IDataProvider {
    private featureModel: Model<DataModel>;
    private connection: Connection | undefined;

    constructor(options?: Options) {
        if (options?.connection) {
            this.connection = options.connection;
            this.featureModel = this.connection.model<DataModel>('Feature', schema, options.collectionName || DEFAULT_COLLECTION);
        } else {
            this.featureModel = model<DataModel>('Feature', schema, options?.collectionName || DEFAULT_COLLECTION);
        }
    }

    async getAll(): Promise<DataModel[]> {
        const results = await this.featureModel.find({});
        return results;
    }

    async get(key: string): Promise<DataModel | undefined> {
        const result = await this.featureModel.findOne({ key });
        if (!result) return undefined;
        return result;
    }
}