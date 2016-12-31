'use strict';

export const storageSet = (obj: Object): Promise<void | Object> => {
	console.log('Attempting to save to local storage...');

	return new Promise((resolve, reject) => {
		chrome.storage.local.set(obj, () => {
			chrome.runtime.lastError ? reject(chrome.runtime.lastError) : resolve();
		});
	});
};

export const storageGet = (vals: string | Array<string> | Object): Promise<Object> => {
	console.log('Attempting to get from local storage...');

	return new Promise((resolve, reject) => {
		chrome.storage.local.get(vals, (items) => {
			chrome.runtime.lastError ? reject(chrome.runtime.lastError) : resolve(items);
		});
	});
};

export const storageRemove = (vals: Array<string>): Promise<void | Object> => {
	console.log('Attempting to remove from local storage...');

	return new Promise((resolve, reject) => {
		chrome.storage.local.remove(vals, () => {
			chrome.runtime.lastError ? reject(chrome.runtime.lastError) : resolve();
		});
	});
};

export const storageClear = (): Promise<void | Object> => {
	console.log('Attempting to clear storage...');

	return new Promise((resolve, reject) => {
		chrome.storage.local.clear(() => {
			chrome.runtime.lastError ? reject(chrome.runtime.lastError) : resolve();
		});
	});
};
