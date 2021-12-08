import { FeatureFlag, isOn } from '../../src';
import { MongodbDataProvider } from '../../src/providers/MongodbDataProvider';
import { MongoClient } from 'mongodb';
import config from './config.json';

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
    // config data provider
    const client = new MongoClient(config.mongoUrl);
    await client.connect();
    const db = client.db();

    // use data privider
    const dataProvider = new MongodbDataProvider({ db });
    const feature = new FeatureFlag({ dataProvider });

    // load all features from data provider to memory
    // await feature.loadAll();

    // check feature flags
    const list: any[] = [];
    for (const key of config.features) {
        list.push(await print(feature, key));
    }
    list.push(await print(feature, 'other'));
    console.table(list);

    await client.close();
})();