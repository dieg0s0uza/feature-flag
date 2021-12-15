import { MemoryModel } from "../models";

export interface IMemoryProvider {
    /**
     * Get a feature data
     * @param key Unique feature identifier
     * @returns A MemoryModel with value or a undefined value if not found
     */
    get(key: string): Promise<MemoryModel | undefined>

    /**
     * Set a new value to memory
     * @param data MemoryModel with a unique feature identifier and value
     */
    set(data: MemoryModel): Promise<void>

    /**
     * Get all feature data
     * @returns A list of MemoryModel
     */
    getAll(): Promise<MemoryModel[]>

    /**
     * Set a list to memory
     * @param data List of MemoryModel with a unique feature identifier and value
     */
    setAll(data: MemoryModel[]): Promise<void>

    /**
     * Delete all features from memory
     */
    flushAll(): Promise<void>
}