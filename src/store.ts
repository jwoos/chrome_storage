'use strict';

import * as Immutable from 'immutable';

import * as interfaces from './interfaces';
// import * as types from './types';

import * as ChromeEvent from './event';

import * as errors from './errors';
import * as utils from './utils';

export class ChromeStore {
	public readonly chromeStore: chrome.storage.StorageArea;
	public readonly area: string;
	public readonly ready: Promise<void | Error>;

	private storage: Immutable.Map<string, object>;
	private storageHistory: Array<Immutable.Map<string, object>>;
	private synced: boolean;

	constructor(area: string) {
		const readyPromise: interfaces.DeferredPromise = utils.deferPromise();

		this.area = area;
		this.ready = readyPromise.promise;
		this.chromeStore = chrome.storage[area];
		this.storageHistory = [];

		this.sync().then(() => {
			this.synced = true;
			this.saveCurrentState();
			readyPromise.resolve();
		});
	}

	public get(prop: string | Array<string>): object {
		const deep: boolean = Array.isArray(prop);

		let val = deep ? this.storage.getIn(prop as Array<string>) : this.storage.get(prop as string);

		if (utils.isImmutableType(val)) {
			val = val.toJS();
		}

		return val;
	}

	public set(prop: string | Array<string>, val: object, persist: boolean): Promise<void | object> {
		const deep: boolean = Array.isArray(prop);

		this.storage = deep ? this.storage.setIn(prop as Array<string>, val) : this.storage.set(prop as string, val);

		this.saveCurrentState();
		this.synced = false;

		let promise: Promise<void | object> = Promise.resolve();

		if (persist) {
			const data: Immutable.Map<string, object> = deep ?
				this.storage.get(prop[0]) as Immutable.Map<string, object> :
				this.storage.get(prop as string) as Immutable.Map<string, object>;
			promise = this.storageSet(data.toJS()).catch(this.rejectionCatcher);
		}

		return promise;
	}

	public delete(prop: string | Array<string>, persist: boolean): Promise<void | object> {
		const deep: boolean = Array.isArray(prop);

		this.storage = deep ? this.storage.deleteIn(prop as Array<string>) : this.storage.delete(prop as string);

		this.saveCurrentState();
		this.synced = false;

		let promise: Promise<void | object> = Promise.resolve();

		if (persist) {
			if (deep) {
				const data: Immutable.Map<string, object> = this.storage.get(prop[0]) as Immutable.Map<string, object>;
				promise = this.storageSet(data.toJS()).catch(this.rejectionCatcher);
			} else {
				promise = this.storageRemove([prop as string]).catch(this.rejectionCatcher);
			}
		}

		return promise;
	}

	public clear(sync: boolean, persist: boolean): Promise<void | object> {
		this.storage = this.storage.clear();
		this.saveCurrentState();
		this.synced = false;

		let promise: Promise<void | object> = Promise.resolve();

		if (persist) {
			promise = this.storageClear().catch(this.rejectionCatcher);
		}

		return promise;
	}

	public flush(): void {
		if (this.storageHistory.length) {
			this.storageHistory = [];
		}

		if (this.storage.size) {
			this.storage = this.storage.clear();
		}
	}

	public sync(): Promise<void | Array<any>> {
		const promises = [];

		if (!this.synced && this.getLatestState() && !Immutable.is(this.storage, this.getLatestState())) {
			const persist = this.storageSet(this.storage.toJS()).catch(this.rejectionCatcher);

			promises.push(persist);
		}

		this.flush();

		const refresh = this.storageGet(null).then((data) => {
			this.storage = Immutable.fromJS(data) as Immutable.Map<string, object>;
		}, (e) => {
			throw new errors.ChromeStorageError(e);
		});

		promises.push(refresh);

		return Promise.all(promises);
	}

	public saveCurrentState(): void {
		this.storageHistory.push(this.storage);
	}

	public getLatestState(): Immutable.Map<string, object> {
		return this.storageHistory[this.storageHistory.length - 1];
	}

	public getEarliestState(): Immutable.Map<string, object> {
		return this.storageHistory[0];
	}

	protected storageSet(obj: object): Promise<void | object> {
		return new Promise((resolve, reject) => {
			this.chromeStore.set(obj, () => {
				if (chrome.runtime.lastError) {
					reject(chrome.runtime.lastError);
				} else {
					resolve();
					this.synced = true;
				}
			});
		});
	}

	protected storageGet(vals: null | string | Array<string> | object): Promise<object> {
		return new Promise((resolve, reject) => {
			this.chromeStore.get(vals, (items) => {
				chrome.runtime.lastError ? reject(chrome.runtime.lastError) : resolve(items);
			});
		});
	}

	protected storageRemove(vals: Array<string>): Promise<void | object> {
		return new Promise((resolve, reject) => {
			this.chromeStore.remove(vals, () => {
				if (chrome.runtime.lastError) {
					reject(chrome.runtime.lastError);
				} else {
					resolve();
					this.synced = true;
				}
			});
		});
	}

	protected storageClear(): Promise<void | object> {
		return new Promise((resolve, reject) => {
			this.chromeStore.clear(() => {
				if (chrome.runtime.lastError) {
					reject(chrome.runtime.lastError);
				} else {
					resolve();
					this.synced = true;
				}
			});
		});
	}

	private rejectionCatcher(e: Error): void {
		throw new errors.ChromeStorageError(e);
	}
}

// EVENTS
const LISTENERS = ['changed'];
const API_NAME = 'storage';

export const addEventListener = (eventType: string, fn: any, filter?: Array<string>): void => {
	ChromeEvent.addListener({
		api: API_NAME,
		callback: fn,
		eventType,
		filter: filter || [],
		schema: LISTENERS,
	});
};

export const removeEventListener = (eventType: string, fn: any): void => {
	ChromeEvent.removeListener({
		api: API_NAME,
		callback: fn,
		eventType,
		schema: LISTENERS,
	});
};

export class WindowEventTracker extends ChromeEvent.EventTracker {
	constructor() {
		super(LISTENERS);
	}
}
