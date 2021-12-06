import { DataValueType, ValueModel } from "..";

/**
 * 
 * @param value A valid DataValueType or ValueModel type to check 
 * @returns True if a value converted to string is 'true', 't', 'yes', 'y', 'on' or '1'
 */
export function isOn(value: DataValueType | ValueModel | undefined): boolean {
    const _value = value instanceof Object ? (value as ValueModel).value : value;
    if (_value !== null && _value !== undefined) {
        return ['true', 't', 'yes', 'y', 'on', '1'].includes(_value.toString().trim().toLowerCase());
    }
    return false;
};

/**
 * 
 * @param value A valid DataValueType or ValueModel type to check 
 * @returns False if a value converted to string is not a 'true', 't', 'yes', 'y', 'on' or '1'
 */
export function isOff(value: DataValueType | ValueModel | undefined): boolean {
    return !isOn(value);
};