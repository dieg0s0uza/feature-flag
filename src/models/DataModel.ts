import { DataValueType } from "../types";

export interface DataModel {
    key: string;
    value: DataValueType;
    description?: string;
}