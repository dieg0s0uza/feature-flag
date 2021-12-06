import { FeatureFlag, isOn } from '../../src';
import { JsonDataProvider } from '../../src/providers/JsonDataProvider';
import config from './config.json';
import { sep } from 'path';

const print = async (feature: FeatureFlag, key: string) => {
    const data = await feature.get(key);
    return {
        key,
        status: isOn(data) ? 'on' : 'off',
        value: data ? data.value : undefined,
        origin: data ? data.origin : undefined
    };
};

(async () => {
    // config data provider
    const file = `${__dirname}${sep}config.json`;

    // use data provider
    const dataProvider = new JsonDataProvider({ file });
    const feature = new FeatureFlag({ dataProvider });

    // load all features from data provider to memory
    await feature.loadAll();

    // check feature flags
    const list: any[] = [];
    for (const key in config) {
        list.push(await print(feature, key));
    }
    list.push(await print(feature, 'other'));
    console.table(list);

})();