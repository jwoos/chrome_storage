# Chrome Storage
[![Build Status](https://travis-ci.org/jwoos/chrome_storage.svg?branch=master)](https://travis-ci.org/jwoos/chrome_storage)
[![Dependency Status](https://dependencyci.com/github/jwoos/chrome_storage/badge)](https://dependencyci.com/github/jwoos/chrome_storage)
[![Coverage Status](https://coveralls.io/repos/github/jwoos/chrome_storage/badge.svg?branch=master)](https://coveralls.io/github/jwoos/chrome_storage?branch=master)

## What is this?
~~This is a library to abstract away and simplify interactions with the chrome API. The specifics are dependent on which part of the API, but all methods with a callback have been wrapped into a promise. I was initially inspired to write only a storage helper while I was working on an extension, but I realized that an overall helper would be nice.~~

This is a library to provide higher level interactions with the Chrome storage API.

### Highlevel Overview
This library is a wrapper - the chrome storage API is fully capable of the main capabilities by itself. However, it is a pain to work with nested data structures in the store. This library hopes to ease that pain as well as provide more functionality: keeping history and in memory transactions.

The library will keep a history of all actions made - meaning that when you change the store in any way, the previous state will be available. Currently it stores the immutable map in memory - in the future this might be changed to a smarter diffing scheme. Having the previous states also means that you are able to undo any actions in the current application instance. Because the history lives in memory, it will be lost when the extension is reinstantiated. This will probably not be changed as the raw objects would take up too much memory - if I get around to smart diffing and am able to generate concise diffs, I'll think about storing this in the actual storage (with a configurable option, of course).

Another functionality is that most of the transactions will be made in memory. Nothing will be persisted to the store until it hits the transaction limit (default is 5) - i.e. once you make X transactions where X is the transaction limit, it will be persisted to the actual store. This can be configured and even overridden per method. This may not fit everyone's needs but it can be done away with some settings. It's worth noting that between the transaction limits if the extension were to be torn down, the data would be lost. Consider carefully before allowing this option and how many writes you have to do.

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

### Methods

#### constructor
When the store is initialized, it will `sync` with the store. It will retrieve the data from the store and save it to an `Immutable.Map`. At this point, the ready promise will be resolved and the synced property should be `true`. Check if it's ready by seeing if `storeHelper.ready` promise has resolved.
```js
const storeHelper = new ChromeStore(area, syncEvery);
```

Arguments:
- `area`: either 'local' or 'managed' - this determines whether the store will be synced through Chrome's syncing.
- `syncEvery`: the number of actions before the in memory store should sync with the actual store.

Returns an instance of the ChromeStore.

#### `get`
Gets a value from the store.

```js
const val = storeHelper.get(prop);
```

Arguments:
- `prop`: no value, string, or an array of strings. A single string will retrieve a value from the root with that key while an array allows for deep access. Providing no value returns the whole store as JavaScript object.

Returns the value.

#### `set`
Sets the value at the specified path.
```js
const p = storeHelper.get(prop, val, persist);
```

Arguments:
- `prop`: string or an array of strings. A single string will set a value for the root with that key while an array allows for deep access.
- `val`: the actual value to set.
- `persist`: boolean option to override the syncing schedule and persist to the actual store. See the high level overview above.

Returns a promise which resolves if successfully set.

#### `update`
**NOT IMPLEMENTED YET**

#### `delete`
Deletes the value from the specified path.
```js
const p = storeHelper.delete(prop, persist);
```

Arguments:
- `prop`: string or an array of strings. A single string will delete a value for the root with that key while an array allows for deep access.
- `persist`: boolean option to override the syncing schedule and persist to the actual store. See the high level overview above.

Returns a promise which resolves when the value is successfully deleted.

#### `clear`
Clears the storage.
```js
const p = storeHelper.clear(history, persist);
```

Arguments:
- `history`: boolean option on whether to wipe the history as well
- `persist`: boolean option to override the syncing schedule and persist to the actual store. See the high level overview above.

Returns a promise which resolves when the store is successfully cleared.

#### `sync`
Syncs the in memory store and the actual store.
```js
const p = storeHelper.sync();
```

Arguments:

Returns a promise which resolves when the store is susccessfully synced.

#### `saveCurrentState`
Saves current state to history.
```js
storeHelper.saveCurrentState();
```

Arguments:

Returns nothing.

#### `getLatestState`
Gets the most recent state saved.
```js
const state = storeHelper.getLatestState();
```

Arguments:

Returns the most recently saved state as an Immutable Map.

#### `getEarliestState`
Gets the initial state.
```js
const state = storeHelper.getEarliestState();
```

Arguments:

Returns the first state as an Immutable Map.

### Properties
- `store`: the in memory store.
- `area`: 'local' or 'managed'.
- `ready`: a promise resolving when the initialization is done.
- `storage`: the `chrome.storage` API by area.
- `history`: the history of all changes since instantiation.
- `synced`: whether the in memory and store are in sync.
- `lastSyncedIndex`: at which action number, it was synced.
