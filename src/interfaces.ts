import * as types from './types';

export interface DeferredPromise {
	resolve: any;
	reject: any;
	promise: Promise<any>;
};

export interface Configuration {
	onChange?: types.ChangeFn;
	area?: string;
	trackChanges?: boolean;
}

export interface ChangeLog {
	changes: Object;
	area: string;
	timestamp: Date;
}

export interface Change {
	[key: string]: chrome.storage.StorageChange;
}
