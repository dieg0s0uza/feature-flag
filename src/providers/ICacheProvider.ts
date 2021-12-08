import { CacheModel } from "../models";

export interface ICacheProvider {
    /**
     * Get a feature data
     * @param key Unique feature identifier
     * @returns A CacheModel with value or a undefined value if not found
     */
    get(key: string): Promise<CacheModel | undefined>

    /**
     * Set a new value to cache
     * @param data CacheModel with a unique feature identifier and value
     */
    set(data: CacheModel): Promise<void>
}