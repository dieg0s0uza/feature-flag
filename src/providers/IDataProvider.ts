import { DataModel } from "../models/DataModel";

export interface IDataProvider {
    /**
     * Get a feature data
     * @param key Unique feature identifier
     * @returns A model with valid value (including null) or undefined if key not found
     */
    get(key: string): Promise<DataModel | undefined>

    /**
     * Get all feature data
     * @returns A list of model with valid value (including null)
     */
    getAll(): Promise<DataModel[]>
}