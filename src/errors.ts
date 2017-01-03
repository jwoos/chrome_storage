'use strict';

// Error to throw when Chrome storage API fails
export class ChromeStorageError extends Error {
	public readonly name: string;
	public readonly message: string;

	constructor(message) {
		super(message);

		this.name = 'ChromeStorageError';
	}
}
