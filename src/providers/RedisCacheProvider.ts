import { ICacheProvider } from './';
import { CacheModel } from './../models'

interface Options {
    /** A client instance to Redis */
    client: any,
    /** Lifetime (in seconds) of each feature in memory. Default: 3600 */
    lifetime?: number
}

export class RedisCacheProvider implements ICacheProvider {
    private client: any;
    private lifetime?: number;
    constructor(options: Options) {
        this.client = options.client;
        this.lifetime = options.lifetime || 3600;
    }
    async get(key: string): Promise<CacheModel | undefined> {
        const result = await this.client.get(key);
        return result ? { key, value: JSON.parse(result) } : undefined;
    }
    async set(data: CacheModel): Promise<void> {
        await this.client.set(data.key, JSON.stringify(data.value), { EX: this.lifetime });
    }
}