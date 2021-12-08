import { FeatureFlag, isOn } from '../../src';
import { JsonDataProvider } from '../../src/providers/JsonDataProvider';
import objData from './object.json';
import arrData from './array.json';

const print = async (feature: FeatureFlag, key: string) => {
    const data = await feature.get(key);
    return {
        key,
        status: isOn(data) ? 'on' : 'off',
        value: data && data.value,
        origin: data && data.origin
    };
};

(async () => {
    // load json from file
    // const file = `${__dirname}${path.sep}array.json`;

    // use data provider
    const dataProvider = new JsonDataProvider({ data: arrData });
    const feature = new FeatureFlag({ dataProvider });

    // load all features from data provider to memory
    // await feature.loadAll();

    // check feature flags
    const list: any[] = [];
    for (const key in objData) {
        list.push(await print(feature, key));
    }
    list.push(await print(feature, 'other'));
    console.table(list);

})();