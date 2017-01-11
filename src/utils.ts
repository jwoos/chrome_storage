'use strict';

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

// TODO refine this
export const addListener = (options: Object) => {
	const allowed = schema.map((elem) => {
		return `on${elem[0].toUpperCase()}${elem.slice(1)}`;
	}).includes(eventType);

	if (!allowed) {
		throw new errors.ChromeEventError(`Event of type ${eventType} is not allowed on chrome.${api}`);
	}

	chrome[api][eventType].addListener(fn);
};
