# Chrome Storage
[![Build Status](https://travis-ci.org/jwoos/chrome_storage.svg?branch=master)](https://travis-ci.org/jwoos/chrome_storage)
[![Dependency Status](https://dependencyci.com/github/jwoos/chrome_storage/badge)](https://dependencyci.com/github/jwoos/chrome_storage)
[![Coverage Status](https://coveralls.io/repos/github/jwoos/chrome_storage/badge.svg?branch=master)](https://coveralls.io/github/jwoos/chrome_storage?branch=master)

## What is this?
~~This is a library to abstract away and simplify interactions with the chrome API. The specifics are dependent on which part of the API, but all methods with a callback have been wrapped into a promise. I was initially inspired to write only a storage helper while I was working on an extension, but I realized that an overall helper would be nice.~~
This is a library to provide higher level interactions with the Chrome storage API.

## Chrome API

### chrome.storage
LINK: https://developer.chrome.com/extensions/storage

When the store is initialized, it will `sync` with the store. It will retrieve the data from the store and save it to an Immutable.Map. At this point, the ready promise will be resolved and the synced property should be true.

```js
const storeHelper = new ChromeStore({
	area: 'local',
	onChange: (changes, area) => {
		console.log(changes, area);
	}
});
```
