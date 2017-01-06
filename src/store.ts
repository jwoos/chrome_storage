'use strict';

import {LoDashStatic} from '@types/lodash';

import * as _ from 'lodash';

import * as interfaces from './interfaces';
import * as types from './types';

import * as errors from './errors';
import * as utils from './utils';

export class ChromeStore {
	public readonly _: LoDashStatic;
	public readonly config: interfaces.Configuration;
	public readonly utils: Object;
	public readonly ready: Promise<void | Error>;
	public storage: Object;
	private chromeStore: chrome.storage.StorageArea;
	public readonly changes: Array<interfaces.ChangeLog>;

	constructor(config: interfaces.Configuration | void) {
		const readyPromise: interfaces.DeferredPromise = utils.deferPromise();

		this._ = _;
		this.config = Object.assign(config || {}, {
			onChange: () => {},
			area: 'local',
			trackChanges: true
		});
		this.utils = utils;
		this.ready = readyPromise.promise;
		this.storage = {};

		this.chromeStore = chrome.storage[this.config.area];
		this.changes = [];

		this.storageGet(null).then((data) => {
			readyPromise.resolve();
			this.storage = data;
		}, (e) => {
			throw new errors.ChromeStorageError(e);
		});
	}

	private prepareStorage(): void {
		const keys = Object.keys(this.storage);

		for (let k of keys) {
			const val = this.storage[k];
			this.storage[`_${k}`] = val;

			Object.defineProperty(this.storage, k, {
				get: () => {
					return this.storage[`_${k}`];
				},
				set: () => {
					throw new errors.ChromeStoreError('Now');
				}
			});
		}
	}

	private validateConfig(): boolean {
		const schema = {
			onChange: 'function',
			trackChanges: 'boolean',
			area: ['local', 'sync']
		};

		const keys = Object.keys(schema);
		let valid = true;

		for (let k of keys) {
			const check = schema[k];
			if (typeof check === 'string') {
				if (typeof this.config[k] !== check) {
					valid = false;
					break;
				}
			} else if (Array.isArray(check)) {
				if (!check.includes(this.config[k])) {
					valid = false;
					break;
				}
			}
		}

		return valid;
	}

	private addEventListener(fn: types.ChangeFn | void): void {
		chrome.storage.onChanged.addListener((changes: interfaces.Change, area: string) => {
			if (fn) {
				fn(changes, area);
			}

			// TODO might need to extract values and make a copy
			const change: interfaces.ChangeLog = {
				changes,
				area,
				timestamp: new Date()
			};

			this.changes.push(change);
		});
	}

	public storageSet(obj: Object): Promise<void | Object> {
		return new Promise((resolve, reject) => {
			this.chromeStore.set(obj, () => {
				chrome.runtime.lastError ? reject(chrome.runtime.lastError) : resolve();
			});
		});
	}

	public storageGet(vals: null | string | Array<string> | Object): Promise<Object> {
		return new Promise((resolve, reject) => {
			this.chromeStore.get(vals, (items) => {
				chrome.runtime.lastError ? reject(chrome.runtime.lastError) : resolve(items);
			});
		});
	}

	public storageRemove(vals: Array<string>): Promise<void | Object> {
		return new Promise((resolve, reject) => {
			this.chromeStore.remove(vals, () => {
				chrome.runtime.lastError ? reject(chrome.runtime.lastError) : resolve();
			});
		});
	}

	public storageClear(): Promise<void | Object> {
		return new Promise((resolve, reject) => {
			this.chromeStore.clear(() => {
				chrome.runtime.lastError ? reject(chrome.runtime.lastError) : resolve();
			});
		});
	}
}
