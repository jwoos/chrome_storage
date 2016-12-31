'use strict';

import {LoDashStatic} from '@types/lodash';

import * as _ from 'lodash';

import * as utils from './utils';

export class ChromeStore {
	_: LoDashStatic;
	config: Object;
	storage: Object;

	constructor(config: Object | void) {
		this._ = _;
		this.config = config || {};
		this.storage = {};
	}
}

console.log(_);
