'use strict';

import * as Immutable from 'immutable';

import * as interfaces from './interfaces';
// import * as types from './types';

import * as ChromeEvent from './event';

import * as errors from './errors';
import * as utils from './utils';

export class ChromeStore {
	// chrome.storage area
	public readonly store: chrome.storage.StorageArea;
	// local or managed
	public readonly area: string;
	// ready
	public readonly ready: Promise<void | Error>;

	// in memory immutable store
	private storage: Immutable.Map<string, object>;
	// all the previous states
	private history: Array<Immutable.Map<string, object>>;
	// if store is in sync with storage
	private synced: boolean;

	constructor(area: string) {
		const readyPromise: interfaces.DeferredPromise = utils.deferPromise();

		if (!area) {
			area = 'local';
		}

		if (!['local', 'managed'].includes(area)) {
			throw new errors.ChromeStorageError('Not a valid storage option');
		}

		this.area = area;
		this.ready = readyPromise.promise;
		this.store = chrome.storage[area];
		this.storage = Immutable.Map();
		this.history = [];

		this.sync().then(() => {
			this.saveCurrentState();
			readyPromise.resolve();
		});
	}

	public getAsImmutable(prop: void | string | Array<string>): Immutable.Map<string, object> {
		const whole = !prop;
		const deep: boolean = Array.isArray(prop);

		let val;
		if (whole) {
			val = this.storage;
		} else {
			val = deep ? this.storage.getIn(prop as Array<string>) : this.storage.get(prop as string);
		}

		return val;
	}

	public get(prop: void | string | Array<string>): object {
		let val = this.getAsImmutable(prop);

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
			prop = deep ? prop[0] : prop;
			const data: Immutable.Map<string, object> = this.getAsImmutable(prop as string) as Immutable.Map<string, object>;
			promise = this.storeSet({[prop[0]]: data.toJS()}).catch(this.rejectionCatcher);
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
				promise = this.storeSet(data.toJS()).catch(this.rejectionCatcher);
			} else {
				promise = this.storeDelete([prop as string]).catch(this.rejectionCatcher);
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
			promise = this.storeClear().catch(this.rejectionCatcher);
		}

		return promise;
	}

	public flush(): void {
		if (this.history.length) {
			this.history = [];
		}

		if (this.storage.size) {
			this.storage = this.storage.clear();
		}
	}

	public sync(): Promise<void | Array<any>> {
		const promises = [];

		if (!this.synced && this.getLatestState() && !Immutable.is(this.storage, this.getLatestState())) {
			const persist = this.storeSet(this.storage.toJS()).catch(this.rejectionCatcher);

			promises.push(persist);
		}

		this.flush();

		const refresh = this.storeGet(null).then((data) => {
			this.storage = Immutable.fromJS(data) as Immutable.Map<string, object>;
		}, (e) => {
			throw new errors.ChromeStorageError(e);
		});

		promises.push(refresh);

		return Promise.all(promises).then(() => {
			this.synced = true;
		});
	}

	public saveCurrentState(): void {
		this.history.push(this.storage);
	}

	public getLatestState(): Immutable.Map<string, object> {
		return this.history[this.history.length - 1];
	}

	public getEarliestState(): Immutable.Map<string, object> {
		return this.history[0];
	}

	protected storeSet(obj: object): Promise<void | object> {
		return new Promise((resolve, reject) => {
			this.store.set(obj, () => {
				if (chrome.runtime.lastError) {
					reject(chrome.runtime.lastError);
				} else {
					resolve();
					this.synced = true;
				}
			});
		});
	}

	protected storeGet(vals: null | string | Array<string> | object): Promise<object> {
		return new Promise((resolve, reject) => {
			this.store.get(vals, (items) => {
				chrome.runtime.lastError ? reject(chrome.runtime.lastError) : resolve(items);
			});
		});
	}

	protected storeDelete(vals: Array<string>): Promise<void | object> {
		return new Promise((resolve, reject) => {
			this.store.remove(vals, () => {
				if (chrome.runtime.lastError) {
					reject(chrome.runtime.lastError);
				} else {
					resolve();
					this.synced = true;
				}
			});
		});
	}

	protected storeClear(): Promise<void | object> {
		return new Promise((resolve, reject) => {
			this.store.clear(() => {
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
