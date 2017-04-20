'use strict';

import { ChromeStore } from '../../src/store';

describe('ChromeStore', () => {
	describe('Method: constructor', () => {
		let cs: ChromeStore;

		beforeEach(() => {
			cs = new ChromeStore('local');
		});

		it('should initialize', () => {
			expect(cs).not.toBeNull();
		});
	});
});
