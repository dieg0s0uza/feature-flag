import { IDataProvider, ICacheProvider, IMemoryProvider } from "./providers";
import { isOn, isOff } from "./utils";
import { ValueModel, DataModel, CacheModel, MemoryModel } from "./models";
import { DataValueType } from "./types";
import { ProviderEnum } from "./enums";

interface Options {
    dataProvider: IDataProvider
    cacheProvider?: ICacheProvider
    memoryProvider?: IMemoryProvider
}

interface GetOptions {
    noCache: boolean,
    noMemory: boolean
}

export class FeatureFlag {
    private dataProvider: IDataProvider;
    private cacheProvider?: ICacheProvider;
    private memoryProvider?: IMemoryProvider;

    constructor(options: Options) {
        this.dataProvider = options.dataProvider;
        this.cacheProvider = options.cacheProvider;
        this.memoryProvider = options.memoryProvider;
    }

    private async getFromMemory(key: string): Promise<MemoryModel | undefined> {
        if (!this.memoryProvider) return undefined;
        return await this.memoryProvider.get(key);
    }

    private async getFromCache(key: string): Promise<CacheModel | undefined> {
        if (!this.cacheProvider) return undefined;
        return await this.cacheProvider.get(key);
    }

    private async getFromData(key: string): Promise<DataModel | undefined> {
        return await this.dataProvider.get(key);
    }

    private async setCache(data: CacheModel): Promise<void> {
        if (this.cacheProvider) {
            await this.cacheProvider.set(data);
        }
    }

    private async setMemory(data: MemoryModel): Promise<void> {
        if (this.memoryProvider) {
            await this.memoryProvider.set(data);
        }
    }

    /**
     * Return all features from data
     * @returns Promise<DataModel[]>
     */
    async getAll(): Promise<DataModel[]> {
        const data = await this.dataProvider.getAll();
        return data;
    }

    /**
     * Load all features from data provider to memory
     * @returns List of features loaded
     */
    async loadMemory(): Promise<DataModel[]> {
        if (!this.memoryProvider) {
            throw new Error("Memory provider is not defined");
        }
        const data = await this.dataProvider.getAll();
        this.memoryProvider.setAll(data.map(a => ({
            key: a.key,
            value: a.value,
            description: a.description
        })));
        return data;
    }

    /**
     * Clear memory
     * @returns void
     */
    async flushMemory(): Promise<void> {
        if (!this.memoryProvider) {
            throw new Error("Memory provider is not defined");
        }
        return this.memoryProvider.flushAll();
    }

    /**
     * Return the feature data
     * @param key Unique feature identifier
     * @param options GetOptions 
     * @returns ValueModel with origin provider, key and value or undefined
     */
    async get(key: string, options?: GetOptions): Promise<ValueModel | undefined> {
        if (!options?.noMemory) {
            const memoryResult = await this.getFromMemory(key);
            if (memoryResult !== undefined) {
                return {
                    key,
                    value: memoryResult.value,
                    description: memoryResult.description,
                    origin: ProviderEnum.Memory
                };
            }
        }

        if (!options?.noCache) {
            const cacheResult = await this.getFromCache(key);
            if (cacheResult !== undefined) {
                await this.setMemory({ key, value: cacheResult.value })
                return {
                    key,
                    value: cacheResult.value,
                    origin: ProviderEnum.Cache
                };
            }
        }

        const dataResult = await this.getFromData(key);
        if (dataResult !== undefined) {
            await this.setCache({ key, value: dataResult.value });
            await this.setMemory({
                key,
                value: dataResult.value,
                description: dataResult.description
            });
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
