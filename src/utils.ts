'use strict';

import {InterfaceDeferredPromise} from './interfaces';

export const storageSet = (obj: Object): Promise<void | Object> => {
	return new Promise((resolve, reject) => {
		chrome.storage.local.set(obj, () => {
			chrome.runtime.lastError ? reject(chrome.runtime.lastError) : resolve();
		});
	});
};

export const storageGet = (vals: void | string | Array<string> | Object): Promise<Object> => {
	return new Promise((resolve, reject) => {
		chrome.storage.local.get(vals, (items) => {
			chrome.runtime.lastError ? reject(chrome.runtime.lastError) : resolve(items);
		});
	});
};

export const storageRemove = (vals: Array<string>): Promise<void | Object> => {
	return new Promise((resolve, reject) => {
		chrome.storage.local.remove(vals, () => {
			chrome.runtime.lastError ? reject(chrome.runtime.lastError) : resolve();
		});
	});
};

export const storageClear = (): Promise<void | Object> => {
	return new Promise((resolve, reject) => {
		chrome.storage.local.clear(() => {
			chrome.runtime.lastError ? reject(chrome.runtime.lastError) : resolve();
		});
	});
};

export const deferPromise = (): InterfaceDeferredPromise => {
	const deferred: InterfaceDeferredPromise = {
		promise: null,
		reject: null,
		resolve: null,
	};

	deferred.promise = new Promise((res, rej) => {
		deferred.resolve = res;
		deferred.reject = rej;
	});

	return deferred;
};
