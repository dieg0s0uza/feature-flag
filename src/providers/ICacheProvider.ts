import { CacheValueType, DataValueType } from "../types";

export interface ICacheProvider {
    /**
     * Get a feature data
     * @param key Unique feature identifier
     * @returns A CacheValueType converted from a string or a undefined value if not found
     */
    get(key: string): Promise<CacheValueType | undefined>

    /**
     * Set a new value to cache
     * @param key Unique feature identifier
     * @param value A DataValueType that can be converted to string
     */
    set(key: string, value: DataValueType): Promise<void>
}