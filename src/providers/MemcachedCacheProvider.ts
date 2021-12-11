import { ICacheProvider } from './';
import { CacheModel } from './../models'

interface Options {
    /** A client instance to Memcached */
    client: any,
    /** Lifetime (in seconds) of each feature in memory. Default: 3600 */
    lifetime?: number
}

export class MemcachedCacheProvider implements ICacheProvider {
    private client: any;
    private lifetime?: number;
    constructor(options: Options) {
        this.client = options.client;
        this.lifetime = options.lifetime || 3600;
    }
    async get(key: string): Promise<CacheModel | undefined> {
        const { value } = await this.client.get(key);
        return value ? { key, value: JSON.parse(value) } : undefined;
    }
    async set(data: CacheModel): Promise<void> {
        await this.client.set(data.key, JSON.stringify(data.value), { expires: this.lifetime });
    }
}