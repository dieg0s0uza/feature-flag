import { IDataProvider } from '.';
import { DataModel } from '../models';
import { DynamoDB, DynamoDBClient } from "@aws-sdk/client-dynamodb"
import { DynamoDBDocumentClient, GetCommand, ScanCommand } from "@aws-sdk/lib-dynamodb";

const DEFAULT_TABLE = 'features';

interface Options {
    /** Table name of data. Default: 'features' */
    tableName?: string,
    /** An instance of dynamodb */
    client: DynamoDB | DynamoDBClient
}

export class DynamodbDataProvider implements IDataProvider {
    private client: DynamoDBDocumentClient;
    private tableName: string;

    constructor(options: Options) {
        this.client = DynamoDBDocumentClient.from(options.client);
        this.tableName = options.tableName || DEFAULT_TABLE;
    }

    async getAll(): Promise<DataModel[]> {
        const params = {
            TableName: this.tableName
        };
        const { Items, Count } = await this.client.send(new ScanCommand(params));
        if (!Items || !Count) return [];
        return Items as DataModel[];
    }

    async get(key: string): Promise<DataModel | undefined> {
        const params = {
            TableName: this.tableName,
            Key: { key }
        };
        const { Item, ...data } = await this.client.send(new GetCommand(params));
        if (!Item) return undefined;
        return {
            key: Item.key,
            value: Item.value
        }
    }
}