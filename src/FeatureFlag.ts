import { IDataProvider } from "./providers/IDataProvider";
import { ICacheProvider } from "./providers/ICacheProvider";
import { isOn, isOff } from "./utils";
import { DataValueType, CacheValueType } from "./types";
import { ValueModel, DataModel } from "./models";
import { ProviderEnum } from "./enums";

interface Options {
    dataProvider: IDataProvider
    cacheProvider?: ICacheProvider
}

interface GetOptions {
    noCached: boolean
}

export class FeatureFlag {
    private dataProvider: IDataProvider;
    private cacheProvider?: ICacheProvider;
    private list: DataModel[] = [];

    constructor(options: Options) {
        this.dataProvider = options.dataProvider;
        this.cacheProvider = options.cacheProvider;
    }

    private getFromMemory(key: string): DataValueType | undefined {
        const dataResult = this.list.find(a => a.key === key);
        return dataResult === undefined ? undefined : dataResult.value;
    }

    private async getFromCache(key: string): Promise<CacheValueType | undefined> {
        if (!this.cacheProvider) return undefined;
        return await this.cacheProvider.get(key);
    }

    private async getFromData(key: string): Promise<DataValueType | undefined> {
        const dataResult = await this.dataProvider.get(key);
        return dataResult === undefined ? undefined : dataResult.value;
    }

    private async updateCache(key: string, value: DataValueType): Promise<void> {
        if (!this.cacheProvider) return;
        this.cacheProvider.set(key, value);
    }

    /**
     * Load all features from data provider in memory
     * @returns List of features in memory
     */
    async loadAll(): Promise<DataModel[]> {
        this.list = await this.dataProvider.getAll();
        return this.list;
    }

    /**
     * Return the feature from memory, cache provider or data provider
     * @param key Unique feature identifier
     * @param GetOptions 
     * @returns Model with origin provider and value boolean, number, string, null or undefined
     */
    async get(key: string, options?: GetOptions): Promise<ValueModel | undefined> {
        const memoryResult = this.getFromMemory(key);
        if (memoryResult !== undefined) {
            return {
                key,
                value: memoryResult,
                origin: ProviderEnum.Memory
            };
        }

        if (!options?.noCached) {
            const cacheResult = await this.getFromCache(key);
            if (cacheResult !== undefined) {
                return {
                    key,
                    value: cacheResult,
                    origin: ProviderEnum.Cache
                };
            }
        }

        const dataResult = await this.getFromData(key);
        if (dataResult !== undefined) {
            await this.updateCache(key, dataResult)
        }
        return dataResult === undefined ? undefined : {
            key,
            value: dataResult,
            origin: ProviderEnum.Data
        };
    }

    /**
     * Return true if feature is on
     * @param key Unique feature identifier
     * @param GetOptions
     * @returns true if value is number 1, boolean true or string '1', 'true', 't', 'on', 'y', 'yes'
     */
    async isOn(key: string, options?: GetOptions): Promise<boolean> {
        const result = await this.get(key, options);
        return isOn(result?.value);
    }

    /**
     * Return true if feature is off
     * @param key Unique feature identifier
     * @param GetOptions
     * @returns true if value is number diff of 1, boolean false or string out of '1', 'true', 't', 'on', 'y', 'yes'
     */
    async isOff(key: string, options?: GetOptions): Promise<boolean> {
        const result = await this.get(key, options);
        return isOff(result?.value);
    }

};

export default FeatureFlag;
