'use strict';

import * as interfaces from './interfaces';

import * as errors from './errors';

export class EventTracker {
	public readonly events: Object;
	public readonly schema: Array<string>;

	constructor(schema) {
		this.schema = schema;

		for (let e of schema.keys()) {
			this.events[e] = [];
		}
	}

}

const toProperEventName = (name): string => {
	return `on${name[0].toUpperCase()}${name.slice(1)}`;
};

const hasListener = (api: string, eventType: string, fn: any): boolean => {
	return chrome[api][eventType].hasListener(fn);
};

const validate = (api: string, eventType: string, schema: Array<string>, fn: any, action: string): void | never => {
	const allowed = schema.includes(eventType);

	if (!allowed) {
		throw new errors.ChromeEventError(`Event of type ${eventType} is not allowed on chrome.${api}`);
	}

	if (action === 'remove') {
		if (!hasListener(api, eventType, fn)) {
			throw new errors.ChromeEventError(`chrome.${api}.${eventType} does not have listener ${fn.toString()}`);
		}
	}
};

export const addListener = (config: interfaces.EventConfiguration): void => {
	const {api, callback, eventType, filter, schema} = config;
	const properEventName = toProperEventName(eventType);

	validate(api, properEventName, schema, callback, 'add');

	chrome[api][properEventName].addListener(callback, filter);
};

export const removeListener = (config: interfaces.EventConfiguration): void => {
	const {api, callback, eventType, schema} = config;
	const properEventName = toProperEventName(eventType);

	validate(api, properEventName, schema, callback, 'remove');

	chrome[api][properEventName].removeListener(callback);
};

// TODO adding, removing, and tracking rules
// filter validation
