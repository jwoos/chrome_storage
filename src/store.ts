'use strict';

import {LoDashStatic} from '@types/lodash';

import * as Immutable from 'immutable';
import * as _ from 'lodash';

import * as interfaces from './interfaces';
import * as types from './types';

import * as errors from './errors';
import * as utils from './utils';

export class ChromeStore {
	public readonly _: LoDashStatic;
	public readonly config: Immutable.Map<string, string | boolean | types.ChangeFn>;
	public readonly ready: Promise<void | Error>;
	public readonly utils: Object;

	public storage: Immutable.Map<string, Object>;
	public synced: boolean;

	private deferredActions: Array<Object>;
	private chromeStore: chrome.storage.StorageArea;
	private storageHistory: Array<Immutable.Map<string, Object>>;

	constructor(config: interfaces.Configuration | void) {
		const readyPromise: interfaces.DeferredPromise = utils.deferPromise();

		this._ = _;

		this.config = Immutable.fromJS(Object.assign(config || {}, {
			area: 'local',
			onChange: null
		}));

		this.utils = utils;
		this.ready = readyPromise.promise;
		this.chromeStore = chrome.storage[<string> this.config.get('area')];
		this.storageHistory = [];

		this.sync().then(() => {
			synced = true;
			this.saveCurrentState();
			readyPromise.resolve();
		});
	}

	get(prop: string): Object {}

	getAll(): Object {}

	set(prop: string, val: Object): void {}

	batch(): Promise<void> {}

	delete(prop: string): void {}

	clear(sync: boolean): void {
		this.storageClear().then(() => {
			this.storage = this.storage.clear();
			this.saveCurrentState();
		}, (e) => {
			throw new errors.ChromeStorageError(e);
		});
	}

	undo(): void {}

	flush(): void {
		if (this.storageHistory.length) {
			this.storageHistory = [];
		}

		if (this.storage.size) {
			this.storage = this.storage.clear();
		}
	}

	sync(): Promise<void> {
		const promises = [];

		if (!this.synced && this.getLatestState() && !Immutable.is(this.storage, this.getLatestState())) {
			const persist = this.storageSet(this.storage.toJS(), (e) => {
				throw new errors.ChromeStorageError(e);
			});

			promises.push(persist);
		}

		this.flush();

		const refresh = this.storageGet(null).then((data) => {
			this.storage = <Immutable.Map<string, Object>> Immutable.fromJS(data);
		}, (e) => {
			throw new errors.ChromeStorageError(e);
		});

		promises.push(refresh);

		return Promise.all(promises);
	}

	public saveCurrentState(): void {
		this.storageHistory.push(this.storage);
	}

	public getLatestState(): Immutable.Map<string, Object> {
		return this.storageHistory[this.storageHistory.length - 1];
	}

	public getEarliestState(): Immutable.Map<string, Object> {
		return this.storageHistory[0];
	}

	protected storageSet(obj: Object): Promise<void | Object> {
		return new Promise((resolve, reject) => {
			this.chromeStore.set(obj, () => {
				if (chrome.runtime.lastError) {
					reject(chrome.runtime.lastError)
				} else {
					resolve();
					this.synced = true;
				}
			});
		});
	}

	protected storageGet(vals: null | string | Array<string> | Object): Promise<Object> {
		return new Promise((resolve, reject) => {
			this.chromeStore.get(vals, (items) => {
				chrome.runtime.lastError ? reject(chrome.runtime.lastError) : resolve(items);
			});
		});
	}

	protected storageRemove(vals: Array<string>): Promise<void | Object> {
		return new Promise((resolve, reject) => {
			this.chromeStore.remove(vals, () => {
				if (chrome.runtime.lastError) {
					reject(chrome.runtime.lastError)
				} else {
					resolve();
					this.synced = true;
				}
			});
		});
	}

	protected storageClear(): Promise<void | Object> {
		return new Promise((resolve, reject) => {
			this.chromeStore.clear(() => {
				if (chrome.runtime.lastError) {
					reject(chrome.runtime.lastError)
				} else {
					resolve();
					this.synced = true;
				}
			});
		});
	}

	private validateConfig(): boolean {
		const schema = {
			area: ['local', 'sync'],
			onChange: 'function',
			trackChanges: 'boolean',
		};

		const keys = Object.keys(schema);
		let valid = true;

		for (let k of keys) {
			const check = schema[k];
			if (typeof check === 'string') {
				if (typeof this.config.get(k) !== check) {
					valid = false;
					break;
				}
			} else if (Array.isArray(check)) {
				if (!check.includes(this.config.get(k))) {
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
				area,
				changes,
				timestamp: new Date(),
			};

			this.changes.push(change);
		});
	}
}
