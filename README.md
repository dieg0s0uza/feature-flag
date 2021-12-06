
# Feature Flag

It's a node Feature Flag module with data and cache provider.

You can use this module to use feature flag status on/off or to get config value.

## Install

just:

```
#npm install node-feature-flag
```

## Simple json data usage

```
import { FeatureFlag, JsonDataProvider } from 'node-feature-flag'; 

const data = {
    login: true,
    'login/user.name': false
};

const dataProvider = new JsonDataProvider({ data });
const featureFlag = new FeatureFlag({ dataProvider });

if (await featureFlag.isOn('login')) {
    if (await featureFlag.isOff('login/user.name')) {
        return;
    }
    // continue...
}
```
