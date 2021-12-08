import { DataValueType } from "../types";
import { ProviderEnum } from "../enums";

export interface ValueModel {
    key: string;
    value: DataValueType;
    description?: string;
    readonly origin: ProviderEnum;
}