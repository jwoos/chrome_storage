// import * as types from './types';

export interface DeferredPromise {
	resolve: any;
	reject: any;
	promise: Promise<any>;
};

export interface ChangeLog {
	area: string;
	changes: Object;
	timestamp: Date;
}

export interface Change {
	[key: string]: chrome.storage.StorageChange;
}

export interface EventConfiguration {
	api: string;
	callback: any;
	eventType: string;
	filter?: Array<string>;
	schema: Array<string>;
}
