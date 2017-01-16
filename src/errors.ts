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

export class ChromeStoreError extends Error {
	public readonly name: string;
	public readonly message: string;

	constructor(message) {
		super(message);

		this.name = 'ChromeStoreError';
	}
}

export class ChromeEventError extends Error {
	public readonly name: string;
	public readonly message: string;

	constructor(message) {
		super(message);

		this.name = 'ChromeEventError';
	}
}

export class ChromeError extends Error {
	public readonly name: string;
	public readonly message: string;

	constructor(message) {
		super(message);

		this.name = 'ChromeError';
	}
}
