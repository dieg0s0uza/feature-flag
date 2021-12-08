import { FeatureFlag, isOn } from '../../src';
import mongoose from 'mongoose';
import { MongooseDataProvider } from '../../src/providers/MongooseDataProvider';
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
    await mongoose.connect(config.mongoUrl);

    // use data provider
    const dataProvider = new MongooseDataProvider();
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

    mongoose.disconnect();
})();