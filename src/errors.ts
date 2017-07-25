'use strict';

abstract class BaseError extends Error {
	public readonly name: string = 'BaseError';
	public readonly message: string;

	constructor(message?: string) {
		super(message);
		Object.setPrototypeOf(this, this.constructor.prototype);
	}
}

// Error to throw when Chrome storage API fails
export class ChromeStorageError extends BaseError {
	public readonly name: string = 'ChromeStorageError';
	public readonly message: string;
}

export class ChromeStoreError extends BaseError {
	public readonly name: string = 'ChromeStoreError';
	public readonly message: string;
}

export class ChromeEventError extends BaseError {
	public readonly name: string = 'ChromeEventError';
	public readonly message: string;
}

export class ChromeError extends Error {
	public readonly name: string = 'ChromeError';
	public readonly message: string;
}
