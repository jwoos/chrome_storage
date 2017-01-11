'use strict';

export const get = (windowId: number, getInfo: chrome.windows.GetInfo): Promise<chrome.windows.Window> => {
	return new Promise((resolve, reject) => {
		chrome.windows.get(windowId, getInfo, (w: chrome.windows.Window) => {
			resolve(w);
		});
	});
};

export const getCurrent = (getInfo: chrome.windows.GetInfo): Promise<chrome.windows.Window> => {
	getInfo = getInfo || {};
	return new Promise((resolve, reject) => {
		chrome.windows.getCurrent(getInfo, (w: chrome.windows.Window) => {
			resolve(w);
		});
	});
};

export const getLastFocused = (getInfo: chrome.windows.GetInfo): Promise<chrome.windows.Window> => {
	getInfo = getInfo || {};
	return new Promise((resolve, reject) => {
		chrome.windows.getLastFocused(getInfo, (w: chrome.windows.Window) => {
			resolve(w);
		});
	});
};

export const getAll = (getInfo: chrome.windows.GetInfo): Promise<Array<chrome.windows.Window>> => {
	getInfo = getInfo || {};
	return new Promise((resolve, reject) => {
		chrome.windows.getAll(getInfo, (w: Array<chrome.windows.Window>) => {
			resolve(w);
		});
	});
};

export const create = (data: chrome.windows.CreateData): Promise<chrome.windows.Window> => {
	return new Promise((resolve, reject) => {
		chrome.windows.create(data, (w: chrome.windows.Window) => {
			resolve(w);
		});
	});
};

export const updated = (windowId: number, data: chrome.windows.UpdateInfo): Promise<chrome.windows.Window> => {
	return new Promise((resolve, reject) => {
		chrome.windows.update(windowId, data, (w: chrome.windows.Window) => {
			resolve(w);
		});
	});
};

export const remove = (windowId: number): Promise<void> => {
	return new Promise((resolve, reject) => {
		chrome.windows.remove(windowId, () => {
			resolve();
		});
	});
};

// EVENTS
/*
 *const listeners = {
 *
 *};
 *
 *export const addEventListener = (eventType: string, fn: any, filter?: Array<string>): void => {
 *  const allowed = ['removed', 'created', 'focusChanged'];
 *  utils.addListener(tracker, 'windows', fn, allowed);
 *};
 */
