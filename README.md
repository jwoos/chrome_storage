# Chrome Helper
[![Build Status](https://travis-ci.org/jwoos/chrome_helper.svg?branch=master)](https://travis-ci.org/jwoos/chrome_helper)
[![Dependency Status](https://dependencyci.com/github/jwoos/chrome_helper/badge)](https://dependencyci.com/github/jwoos/chrome_helper)
[![Coverage Status](https://coveralls.io/repos/github/jwoos/chrome_helper/badge.svg?branch=master)](https://coveralls.io/github/jwoos/chrome_helper?branch=master)

### What is this?
This is a library to abstract away and simplify interactions with the chrome API. The specifics is dependent on which part of the API, but all methods with a callback has been wrapped into a promise returning method to avoid callback hell. I was initially inspired to write only a storage helper while I was working on an extension, but I realized that an overall helper would be nice.

### chrome.store
When the store is initialized, it will `sync` with the store. It will retrieve the data from the store and save it to an Immutable.Map. At this point, the ready promise will be resolved and the synced property should be true.

```js
const storeHelper = new ChromeStore({
	area: 'local',
	onChange: (changes, area) => {
		console.log(changes, area);
	}
});
```

### chrome.window
