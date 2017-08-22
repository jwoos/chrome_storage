# Chrome Storage
[![Build Status](https://travis-ci.org/jwoos/chrome_storage.svg?branch=master)](https://travis-ci.org/jwoos/chrome_storage)
[![Dependency Status](https://dependencyci.com/github/jwoos/chrome_storage/badge)](https://dependencyci.com/github/jwoos/chrome_storage)
[![Coverage Status](https://coveralls.io/repos/github/jwoos/chrome_storage/badge.svg?branch=master)](https://coveralls.io/github/jwoos/chrome_storage?branch=master)

## What is this?
~~This is a library to abstract away and simplify interactions with the chrome API. The specifics are dependent on which part of the API, but all methods with a callback have been wrapped into a promise. I was initially inspired to write only a storage helper while I was working on an extension, but I realized that an overall helper would be nice.~~

This is a library to provide higher level interactions with the Chrome storage API.

## Usage
Please note that this is meant to be used either as a TypeScript module or as a script in your Chrome extension. Using it in any other way is not supported officially and completely untested - it may work but it will not be officially supported. I will get around to making it available as a normal JavaScript module when I get the chance.

### TypeScript Module
You can either download or clone the repository and use it that way or do `yarn add chrome_storage` which should allow you to import it.

```typescript
import {ChromeStore} from 'chrome_storage';

const storeHelper = new ChromeStore('local', 5);
```

### JavaScript Vendor File
You can also use the compiled JavaScript and include it as one of your sources. Depending on where you plan to use this, specify it in your manifests file or include it in your HTML file. After inclusion, the `ChromeStorage` namespace should be available globally. Under this property, the actual `ChromeStore` class is available.

```js
const a = ChromeStorage.ChromeStore('local', 5);
```

## Chrome API

### chrome.storage
LINK: https://developer.chrome.com/extensions/storage

When the store is initialized, it will `sync` with the store. It will retrieve the data from the store and save it to an `Immutable.Map`. At this point, the ready promise will be resolved and the synced property should be `true`.

```js
const storeHelper = new ChromeStore('local');
```

### Methods

#### `get`
```
storeHelper.get([prop]): object;
```

Arguments:
- `prop`: no value, string, or an array of strings. A single string will retrieve a value from the root with that key while an array allows for deep access. Providing no value returns the whole store as JavaScript object.

### Properties

