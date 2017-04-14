'use strict';

export const wrap = (api: string, fns: Array<string>) => {
	const wrapped = fns.map((fn) => {
		return (...args) => {
			return new Promise((resolve, reject) => {
				chrome[api][fn](...args, resolve);
			});
		};
	});

	return wrapped;
};
