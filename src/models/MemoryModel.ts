import { DataValueType } from "../types";

export interface MemoryModel {
    key: string;
    value: DataValueType;
    description?: string;
    expireAt?: number;
}