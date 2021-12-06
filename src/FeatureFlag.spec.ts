import { ICacheProvider, JsonDataProvider } from '.';
import FeatureFlag from './FeatureFlag';
import { ProviderEnum } from './enums'
import { CacheValueType, DataValueType } from './types';

describe('Feature Flag', () => {

    describe('Get feature status', () => {

        test('should return flag on for feature true', async () => {
            const data = { test: true };
            const dataProvider = new JsonDataProvider({ data });
            const featureFlag = new FeatureFlag({ dataProvider });
            await expect(featureFlag.isOn('test')).resolves.toBeTruthy();
        });

        test('should return flag off for feature false', async () => {
            const data = { test: false };
            const dataProvider = new JsonDataProvider({ data });
            const featureFlag = new FeatureFlag({ dataProvider });
            await expect(featureFlag.isOff('test')).resolves.toBeTruthy();
        });

        test('should return flag on for feature 1', async () => {
            const data = { test: 1 };
            const dataProvider = new JsonDataProvider({ data });
            const featureFlag = new FeatureFlag({ dataProvider });
            await expect(featureFlag.isOn('test')).resolves.toBeTruthy();
        });

        test('should return flag off for feature 0', async () => {
            const data = { test: 0 };
            const dataProvider = new JsonDataProvider({ data });
            const featureFlag = new FeatureFlag({ dataProvider });
            await expect(featureFlag.isOff('test')).resolves.toBeTruthy();
        });

        test('should return flag on for feature "1"', async () => {
            const data = { test: "1" };
            const dataProvider = new JsonDataProvider({ data });
            const featureFlag = new FeatureFlag({ dataProvider });
            await expect(featureFlag.isOn('test')).resolves.toBeTruthy();
        });

        test('should return flag off for feature "0"', async () => {
            const data = { test: "0" };
            const dataProvider = new JsonDataProvider({ data });
            const featureFlag = new FeatureFlag({ dataProvider });
            await expect(featureFlag.isOff('test')).resolves.toBeTruthy();
        });

        test('should return flag on for feature "on"', async () => {
            const data = { test: 'on' };
            const dataProvider = new JsonDataProvider({ data });
            const featureFlag = new FeatureFlag({ dataProvider });
            await expect(featureFlag.isOn('test')).resolves.toBeTruthy();
        });

        test('should return flag off for feature "off"', async () => {
            const data = { test: 'off' };
            const dataProvider = new JsonDataProvider({ data });
            const featureFlag = new FeatureFlag({ dataProvider });
            await expect(featureFlag.isOff('test')).resolves.toBeTruthy();
        });

        test('should return flag on for feature "t"', async () => {
            const data = { test: "t" };
            const dataProvider = new JsonDataProvider({ data });
            const featureFlag = new FeatureFlag({ dataProvider });
            await expect(featureFlag.isOn('test')).resolves.toBeTruthy();
        });

        test('should return flag off for feature "f"', async () => {
            const data = { test: "f" };
            const dataProvider = new JsonDataProvider({ data });
            const featureFlag = new FeatureFlag({ dataProvider });
            await expect(featureFlag.isOff('test')).resolves.toBeTruthy();
        });

        test('should return flag on for feature "y"', async () => {
            const data = { test: "y" };
            const dataProvider = new JsonDataProvider({ data });
            const featureFlag = new FeatureFlag({ dataProvider });
            await expect(featureFlag.isOn('test')).resolves.toBeTruthy();
        });

        test('should return flag off for feature "n"', async () => {
            const data = { test: "n" };
            const dataProvider = new JsonDataProvider({ data });
            const featureFlag = new FeatureFlag({ dataProvider });
            await expect(featureFlag.isOff('test')).resolves.toBeTruthy();
        });

        test('should return flag on for feature "yes"', async () => {
            const data = { test: "yes" };
            const dataProvider = new JsonDataProvider({ data });
            const featureFlag = new FeatureFlag({ dataProvider });
            await expect(featureFlag.isOn('test')).resolves.toBeTruthy();
        });

        test('should return flag off for feature "no"', async () => {
            const data = { test: "no" };
            const dataProvider = new JsonDataProvider({ data });
            const featureFlag = new FeatureFlag({ dataProvider });
            await expect(featureFlag.isOff('test')).resolves.toBeTruthy();
        });

        test('should return flag off for feature null', async () => {
            const data = { test: null };
            const dataProvider = new JsonDataProvider({ data });
            const featureFlag = new FeatureFlag({ dataProvider });
            await expect(featureFlag.isOff('test')).resolves.toBeTruthy();
        });

        test('should return flag off for feature undefined', async () => {
            const data = {};
            const dataProvider = new JsonDataProvider({ data });
            const featureFlag = new FeatureFlag({ dataProvider });
            await expect(featureFlag.isOff('test')).resolves.toBeTruthy();
        });
    });

    describe('Get feature value', () => {

        test('should return boolean true for feature true', async () => {
            const data = { test: true };
            const dataProvider = new JsonDataProvider({ data });
            const featureFlag = new FeatureFlag({ dataProvider });
            const feature = await featureFlag.get('test');
            expect(feature).not.toBeUndefined();
            expect(feature?.value).toBe(true);
        });

        test('should return boolean false for feature false', async () => {
            const data = { test: false };
            const dataProvider = new JsonDataProvider({ data });
            const featureFlag = new FeatureFlag({ dataProvider });
            const feature = await featureFlag.get('test');
            expect(feature).not.toBeUndefined();
            expect(feature?.value).toBe(false);
        });

        test('should return number 1 for feature 1', async () => {
            const data = { test: 1 };
            const dataProvider = new JsonDataProvider({ data });
            const featureFlag = new FeatureFlag({ dataProvider });
            const feature = await featureFlag.get('test');
            expect(feature).not.toBeUndefined();
            expect(feature?.value).toBe(1);
        });

        test('should return number 0 for feature 0', async () => {
            const data = { test: 0 };
            const dataProvider = new JsonDataProvider({ data });
            const featureFlag = new FeatureFlag({ dataProvider });
            const feature = await featureFlag.get('test');
            expect(feature).not.toBeUndefined();
            expect(feature?.value).toBe(0);
        });

        test('should return string "1" for feature "1"', async () => {
            const data = { test: "1" };
            const dataProvider = new JsonDataProvider({ data });
            const featureFlag = new FeatureFlag({ dataProvider });
            const feature = await featureFlag.get('test');
            expect(feature).not.toBeUndefined();
            expect(feature?.value).toBe("1");
        });

        test('should return string "0" for feature "0"', async () => {
            const data = { test: "0" };
            const dataProvider = new JsonDataProvider({ data });
            const featureFlag = new FeatureFlag({ dataProvider });
            const feature = await featureFlag.get('test');
            expect(feature).not.toBeUndefined();
            expect(feature?.value).toBe("0");
        });

        test('should return string "on" for feature "on"', async () => {
            const data = { test: "on" };
            const dataProvider = new JsonDataProvider({ data });
            const featureFlag = new FeatureFlag({ dataProvider });
            const feature = await featureFlag.get('test');
            expect(feature).not.toBeUndefined();
            expect(feature?.value).toBe("on");
        });

        test('should return string "off" for feature "off"', async () => {
            const data = { test: "off" };
            const dataProvider = new JsonDataProvider({ data });
            const featureFlag = new FeatureFlag({ dataProvider });
            const feature = await featureFlag.get('test');
            expect(feature).not.toBeUndefined();
            expect(feature?.value).toBe("off");
        });

        test('should return string "t" for feature "t"', async () => {
            const data = { test: "t" };
            const dataProvider = new JsonDataProvider({ data });
            const featureFlag = new FeatureFlag({ dataProvider });
            const feature = await featureFlag.get('test');
            expect(feature).not.toBeUndefined();
            expect(feature?.value).toBe("t");
        });

        test('should return string "f" for feature "f"', async () => {
            const data = { test: "f" };
            const dataProvider = new JsonDataProvider({ data });
            const featureFlag = new FeatureFlag({ dataProvider });
            const feature = await featureFlag.get('test');
            expect(feature).not.toBeUndefined();
            expect(feature?.value).toBe("f");
        });

        test('should return string "y" for feature "y"', async () => {
            const data = { test: "y" };
            const dataProvider = new JsonDataProvider({ data });
            const featureFlag = new FeatureFlag({ dataProvider });
            const feature = await featureFlag.get('test');
            expect(feature).not.toBeUndefined();
            expect(feature?.value).toBe("y");
        });

        test('should return string "n" for feature "n"', async () => {
            const data = { test: "n" };
            const dataProvider = new JsonDataProvider({ data });
            const featureFlag = new FeatureFlag({ dataProvider });
            const feature = await featureFlag.get('test');
            expect(feature).not.toBeUndefined();
            expect(feature?.value).toBe("n");
        });

        test('should return string "yes" for feature "yes"', async () => {
            const data = { test: "yes" };
            const dataProvider = new JsonDataProvider({ data });
            const featureFlag = new FeatureFlag({ dataProvider });
            const feature = await featureFlag.get('test');
            expect(feature).not.toBeUndefined();
            expect(feature?.value).toBe("yes");
        });

        test('should return string "no" for feature "no"', async () => {
            const data = { test: "no" };
            const dataProvider = new JsonDataProvider({ data });
            const featureFlag = new FeatureFlag({ dataProvider });
            const feature = await featureFlag.get('test');
            expect(feature).not.toBeUndefined();
            expect(feature?.value).toBe("no");
        });

        test('should return object null for feature null', async () => {
            const data = { test: null };
            const dataProvider = new JsonDataProvider({ data });
            const featureFlag = new FeatureFlag({ dataProvider });
            const feature = await featureFlag.get('test');
            expect(feature).not.toBeUndefined();
            expect(feature?.value).toBe(null);
        });

        test('should return undefined for feature undefined', async () => {
            const data = {};
            const dataProvider = new JsonDataProvider({ data });
            const featureFlag = new FeatureFlag({ dataProvider });
            const feature = await featureFlag.get('test');
            expect(feature).toBeUndefined();
        });
    });

    describe('Get from provider', () => {

        test('should return from data', async () => {
            const data = { test: true };
            const dataProvider = new JsonDataProvider({ data });
            const featureFlag = new FeatureFlag({ dataProvider });
            const feature = await featureFlag.get('test');
            expect(feature).not.toBeUndefined();
            expect(feature?.origin).toBe(ProviderEnum.Data)
        });

        test('should return from cache', async () => {
            const data = { test: true };
            const dataProvider = new JsonDataProvider({ data });
            class CacheTestProvider implements ICacheProvider {
                async get(key: string): Promise<CacheValueType | undefined> {
                    return JSON.stringify(key === 'test');
                }
                async set(key: string, value: DataValueType): Promise<void> {
                }
            }
            const cacheProvider = new CacheTestProvider();
            const featureFlag = new FeatureFlag({ dataProvider, cacheProvider });
            const feature = await featureFlag.get('test');
            expect(feature).not.toBeUndefined();
            expect(feature?.origin).toBe(ProviderEnum.Cache)
        });

        test('should return from memory', async () => {
            const data = { test: true };
            const dataProvider = new JsonDataProvider({ data });
            const featureFlag = new FeatureFlag({ dataProvider });
            await featureFlag.loadAll();
            const feature = await featureFlag.get('test');
            expect(feature).not.toBeUndefined();
            expect(feature?.origin).toBe(ProviderEnum.Memory)
        });
    });

});