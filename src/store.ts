'use strict';

import {LoDashStatic} from '@types/lodash';

import * as _ from 'lodash';

import * as errors from './errors';
import * as utils from './utils';

export class ChromeStore {
	public readonly _: LoDashStatic;
	public readonly config: Object;
	public readonly methods: Object;
	public ready: Promise<void | Error>;
	public storage: Object;

	constructor(config: Object | void) {
		const readyPromise = utils.deferPromise();

		this._ = _;
		this.config = config || {};
		this.methods = utils;
		this.ready = readyPromise.promise;
		this.storage = {};

		utils.storageGet(null).then((data) => {
			readyPromise.resolve();
			this.storage = data;
		}, (e) => {
			throw new errors.ChromeStorageError(e);
		});
	}

	private setUpProperties() {
		const keys = Object.keys(this.methods);
	}
}
