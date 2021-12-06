import { ICacheProvider } from './ICacheProvider';
import { CacheValueType } from './../types/CacheValueType'

interface Options {
    client: any,
    lifetime?: number
}

export class RedisCacheProvider implements ICacheProvider {
    private client: any;
    private lifetime?: number;
    constructor(options: Options) {
        this.client = options.client;
        this.lifetime = options.lifetime || 3600;
    }
    async get(key: string): Promise<CacheValueType | undefined> {
        const result = await this.client.get(key);
        return result ? JSON.parse(result) : undefined;
    }
    async set(key: string, value: CacheValueType): Promise<void> {
        await this.client.set(key, JSON.stringify(value), { EX: this.lifetime });
    }
}