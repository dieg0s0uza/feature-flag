import { FeatureFlag, isOn } from '../../src';
import mongoose from 'mongoose';
import { MongooseDataProvider } from '../../src/providers/MongooseDataProvider';
import { MemcachedCacheProvider } from '../../src/providers/MemcachedCacheProvider';
import memjs from 'memjs';
import config from './config.json';

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
    await mongoose.connect(config.mongoUrl);

    // config cache provider
    const client = memjs.Client.create(config.memcachedUrl);

    // use data and cache provider
    const dataProvider = new MongooseDataProvider();
    const cacheProvider = new MemcachedCacheProvider({ client, lifetime: 60 });
    const feature = new FeatureFlag({ dataProvider, cacheProvider });

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
    client.close();
})();