
# Feature Flag

This is a node **Feature Flag (Feature Toggle)** module with common data/cache providers like json, mongodb, redis and memcached. If you need another or more complexed provider, feel free to implement it.

If you need more flexibility in your apps, like enable/disable features in production without change environments to deploy manualy or rerun the pipeline, this module is pretty good for you and your team.

It's not only used to turn on or turn off features or test A/B, you can use it to config your app in realtime, getting values from anywere (file, memory, databases, cache, api, realy anywere) to inject in yours business logic to change it when you want.

## Why should I use this one instead of create my own or use another?

- Because it's easy to use, small size and you don't need to spend more time to code again.

- Moreover, you can implement your own provider, just extending or implementing some provider or interface.

- With this module, you can using your own infrastructure, like local or cloud databases, very important when your product or company is not so flexibility to explore other services.

## Install

Using npm:

```bash
npm install node-feature-flag
```

Using yarn:

```bash
yarn add node-feature-flag
```

## Examples

### Using basic **JSON** data provider

```js
import { FeatureFlag, JsonDataProvider } from "node-feature-flag"; 

(async() => {
    const data = {
        "sign_in": true,
        "sign_in_notification": true,
        "min_age": 18 
    };

    // json data provider
    const dataProvider = new JsonDataProvider({ data });
    const featureFlag = new FeatureFlag({ dataProvider });
    
    if (await featureFlag.isOff("sign_in")) {
        throw new Error("The feature flag sign_in is off");
    }

    const data = await featureFlag.get("min_age")
    if (data && data.value < 18) {
        throw new Error("The min age to sign_in is 18 years");
    }

    if (await featureFlag.isOn("sign_in_notification")) {
        console.info("Notify user about sign_in");
    }

    // continue...
})();
```

### Using **Mongoose** data provider

```js
import { FeatureFlag, MongooseDataProvider } from "node-feature-flag"; 
import mongoose from "mongoose";

(async() => {
    // mongoose data provider
    await mongoose.connect("mongodb://localhost:27017/test");
    const dataProvider = new MongooseDataProvider();

    const featureFlag = new FeatureFlag({ dataProvider });
    
    // continue...
})();
```

### Using **Mongodb** (native drive) data provider

```js
import { FeatureFlag, MongodbDataProvider } from "node-feature-flag"; 
import { MongoClient } from "mongodb";

(async() => {
    // mongodb data provider
    const client = new MongoClient("mongodb://localhost:27017/test");
    await client.connect();
    const dataProvider = new MongodbDataProvider({ db: client.db() });

    const featureFlag = new FeatureFlag({ dataProvider });
    
    // continue...
})();
```

### Using **Mongoose** data provider with **Redis** cache provider

```js
import { 
    FeatureFlag, 
    MongooseDataProvider, 
    RedisCacheProvider 
} from "node-feature-flag"; 
import mongoose from "mongoose";
import { createClient } from "redis";

(async() => {
    // mongoose data provider
    await mongoose.connect("mongodb://localhost:27017/test");
    const dataProvider = new MongooseDataProvider();

    // redis cache provider
    const client = createClient({ url: "redis://localhost:6379" });
    await client.connect();
    const cacheProvider = new RedisCacheProvider({ client, lifetime: 60 });

    const featureFlag = new FeatureFlag({ dataProvider, cacheProvider });
    
    // continue...
})();
```

### Using **Mongodb** (native drive) data provider with **Memcached** cache provider

```js
import { 
    FeatureFlag, 
    MongodbDataProvider, 
    MemcachedCacheProvider 
} from "node-feature-flag"; 
import { MongoClient } from "mongodb";
import memjs from "memjs";

(async() => {
    // mongodb data provider
    const client = new MongoClient("mongodb://localhost:27017/test");
    await client.connect();
    const dataProvider = new MongodbDataProvider({ db: client.db() });

    // memcached cache provider
    const client = memjs.Client.create("localhost:11211");
    const cacheProvider = new MemcachedCacheProvider({ client, lifetime: 60 });

    const featureFlag = new FeatureFlag({ dataProvider, cacheProvider });
    
    // continue...
})();
```

### Using your own data provider implementation

```js
import { IDataProvider, DataModel, DataValueType } from "node-feature-flag";

export class MyDataProvider implements IDataProvider {

    async getAll(): Promise<DataModel[]> {
        // return all features from file, json, database, api...
    }

    async get(key: string): Promise<DataModel | undefined> {
        // return a unique feature by key from file, json, database, api...
    }
}
```

### Using your own cache provider implementation

```js
import { ICacheProvider, DataModel, DataValueType } from "node-feature-flag";

export class MyCacheProvider implements ICacheProvider {

    async get(key: string): Promise<CacheValueType | undefined> {
        // return a unique cached feature by key
    }

    async set(key: string, value: CacheValueType): Promise<void> {
        // create/update a unique cached feature by key
    }
}
```

### Feel free to contribute

- If you find a bug or have a good idea, share with us.

- And if you create a new module to data or cache provider, lets us know to add here to help comunnity.

### License & copyright

Licensed under the [MIT License](LICENSE).