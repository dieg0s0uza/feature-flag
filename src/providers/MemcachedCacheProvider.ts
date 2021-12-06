import { ICacheProvider } from './ICacheProvider';
import { CacheValueType, DataValueType } from './../types'

interface Options {
    client: any,
    lifetime?: number
}

export class MemcachedCacheProvider implements ICacheProvider {
    private client: any;
    private lifetime?: number;
    constructor(options: Options) {
        this.client = options.client;
        this.lifetime = options.lifetime || 3600;
    }
    async get(key: string): Promise<CacheValueType | undefined> {
        const { value } = await this.client.get(key);
        return value ? JSON.parse(value) : undefined;
    }
    async set(key: string, value: DataValueType): Promise<void> {
        return await this.client.set(key, JSON.stringify(value), { expires: this.lifetime });
    }
}