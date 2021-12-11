import { FeatureFlag, isOn } from '../../src';
import { JsonDataProvider, MemoryProvider } from '../../src/providers';
import objData from '../json/object.json';
import arrData from '../json/array.json';

const print = async (feature: FeatureFlag, key: string) => {
    const data = await feature.get(key);
    return {
        key,
        status: isOn(data) ? 'on' : 'off',
        value: data && data.value,
        origin: data && data.origin
    };
}

const printAll = async (feature: FeatureFlag) => {
    // check feature flags
    const list: any[] = [];
    for (const key of Object.keys(objData).slice(0, 1)) {
        list.push(await print(feature, key));
    }
    list.push(await print(feature, 'other'));
    console.table(list);
}

(async () => {
    // use memory provider
    const feature = new FeatureFlag({
        dataProvider: new JsonDataProvider({ data: arrData }),
        memoryProvider: new MemoryProvider({ lifetime: 3 })
    });

    // load all features from data provider to memory
    // await feature.loadAll();

    // check feature flags
    console.log('from data...');
    await printAll(feature);
    console.log('from memory after 2seg ...');
    await new Promise(resolve => setTimeout(resolve, 2000));
    await printAll(feature);
    console.log('from memory after 3seg (expired) ...');
    await new Promise(resolve => setTimeout(resolve, 3000));
    await printAll(feature);
})();