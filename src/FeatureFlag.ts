import { IDataProvider } from "./providers";
import { ICacheProvider } from "./providers";
import { isOn, isOff } from "./utils";
import { ValueModel, DataModel, CacheModel } from "./models";
import { DataValueType } from "./types";
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

    private getFromMemory(key: string): DataModel | undefined {
        const dataResult = this.list.find(a => a.key === key);
        return dataResult || undefined;
    }

    private async getFromCache(key: string): Promise<CacheModel | undefined> {
        if (this.cacheProvider) {
            return await this.cacheProvider.get(key);
        }
        return undefined;
    }

    private async getFromData(key: string): Promise<DataModel | undefined> {
        return await this.dataProvider.get(key);
    }

    private async updateCache(data: CacheModel): Promise<void> {
        if (this.cacheProvider) {
            await this.cacheProvider.set(data);
        }
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
     * Return the feature data
     * @param key Unique feature identifier
     * @param options GetOptions 
     * @returns ValueModel with origin provider, key and value or undefined
     */
    async get(key: string, options?: GetOptions): Promise<ValueModel | undefined> {
        const memoryResult = this.getFromMemory(key);
        if (memoryResult !== undefined) {
            return {
                key,
                value: memoryResult.value,
                description: memoryResult.description,
                origin: ProviderEnum.Memory
            };
        }

        if (!options?.noCached) {
            const cacheResult = await this.getFromCache(key);
            if (cacheResult !== undefined) {
                return {
                    key,
                    value: cacheResult.value,
                    origin: ProviderEnum.Cache
                };
            }
        }

        const dataResult = await this.getFromData(key);
        if (dataResult !== undefined) {
            await this.updateCache({ key, value: dataResult.value })
        }
        if (dataResult !== undefined) {
            return {
                key,
                value: dataResult.value,
                description: dataResult.description,
                origin: ProviderEnum.Data
            };
        }
        return undefined;
    }

    /**
     * Return the feature value
     * @param key Unique feature identifiers
     * @param options GetOptions
     * @returns The DataValueType (alias to any)
     */
    async getValue(key: string, options?: GetOptions): Promise<DataValueType | undefined> {
        const data = await this.get(key, options);
        return data && data.value;
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
