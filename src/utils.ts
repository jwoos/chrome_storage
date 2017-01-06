'use strict';

import * as interfaces from './interfaces';

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
