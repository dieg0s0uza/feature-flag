
# Feature Flag

It's a node Feature Flag module with data and cache provider.

You can use this module to use feature flag status on/off or to get config value.

## Install

just:

```
#npm install node-feature-flag
```

## Ex. using json data provider

```
import { FeatureFlag, JsonDataProvider } from 'node-feature-flag'; 

const data = {
    login: true,
    'login:username': false
};

const dataProvider = new JsonDataProvider({ data });
const featureFlag = new FeatureFlag({ dataProvider });

if (await featureFlag.isOn('login')) {
    if (await featureFlag.isOff('login:username')) {
        return;
    }
    // continue...
}
```

## Ex. using mongoose data provider

```
import { FeatureFlag, MongooseDataProvider } from 'node-feature-flag'; 
import mongoose from 'mongoose';

await mongoose.connect('mongodb://localhost:27017/test');

const dataProvider = new MongooseDataProvider();
const featureFlag = new FeatureFlag({ dataProvider });

if (await featureFlag.isOn('login')) {
    if (await featureFlag.isOff('login:username')) {
        return;
    }
    // continue...
}
```

## Ex. using mongoose data provider with redis cache provider

```
import { FeatureFlag, MongooseDataProvider, RedisCacheProvider } from 'node-feature-flag'; 
import mongoose from 'mongoose';
import { createClient } from 'redis';

// mongoose data provider
await mongoose.connect('mongodb://localhost:27017/test');
const dataProvider = new MongooseDataProvider();

// redis cache provider
const client = createClient({ url: 'redis://localhost:6379' });
await client.connect();
const cacheProvider = new RedisCacheProvider({ client, lifetime: 60 });

const featureFlag = new FeatureFlag({ dataProvider, cacheProvider });

if (await featureFlag.isOn('login')) {
    if (await featureFlag.isOff('login:username')) {
        return;
    }
    // continue...
}
```

## Ex. using mongoose data provider with memcached cache provider

```
import { FeatureFlag, MongooseDataProvider, RedisCacheProvider } from 'node-feature-flag'; 
import mongoose from 'mongoose';
import memjs from 'memjs';

// mongoose data provider
await mongoose.connect('mongodb://localhost:27017/test');
const dataProvider = new MongooseDataProvider();

// memcached cache provider
const client = memjs.Client.create(config.memcachedUrl);
const cacheProvider = new MemcachedCacheProvider({ client, lifetime: 60 });

const featureFlag = new FeatureFlag({ dataProvider, cacheProvider });

if (await featureFlag.isOn('login')) {
    if (await featureFlag.isOff('login:username')) {
        return;
    }
    // continue...
}
```

## Implement your own data or cache provider 

```
import { IDataProvider, DataModel, DataValueType } from 'node-feature-flag';

export class MyDataProvider implements IDataProvider {

    async getAll(): Promise<DataModel[]> {
        // return all features from file, database, api ...
    }

    async get(key: string): Promise<DataModel | undefined> {
        // return a unique feature by key from file, database, api ...
    }
}
```
