import { FeatureFlag, isOn } from '../../src';
import mongoose from 'mongoose';
import { MongooseDataProvider } from '../../src/providers/MongooseDataProvider';
import { RedisCacheProvider } from '../../src/providers/RedisCacheProvider';
import { createClient } from 'redis';
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

    // config cache provider
    const client = createClient({
        url: config.redisUrl
    });
    await client.connect();

    // use data and cache provider
    const dataProvider = new MongooseDataProvider();
    const cacheProvider = new RedisCacheProvider({ client, lifetime: 60 });
    const feature = new FeatureFlag({ dataProvider, cacheProvider });

    // check feature flags
    const list: any[] = [];
    for (const key of config.features) {
        list.push(await print(feature, key));
    }
    list.push(await print(feature, 'other'));
    console.table(list);

    mongoose.disconnect();
    client.disconnect();
})();