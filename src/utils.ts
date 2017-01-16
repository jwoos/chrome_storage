'use strict';

import * as Immutable from 'immutable';

import * as interfaces from './interfaces';

import * as errors from './errors';

export const deferPromise = (): interfaces.DeferredPromise => {
	const deferred: interfaces.DeferredPromise = {
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

export const isImmutableType = (obj: any): boolean => {
	// only these two types are used currently
	const isList = Immutable.List.isList(obj);
	const isMap = Immutable.Map.isMap(obj);

	return isList || isMap;
};
