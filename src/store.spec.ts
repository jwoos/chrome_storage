'use strict';

import * as sinon from 'sinon';

import { ChromeStore } from './store';

describe('ChromeStore', () => {
	describe('[Method] constructor', () => {
		let cs: ChromeStore;

		it('should initialize', () => {
			const mockSync = sinon.stub(ChromeStore.prototype, 'sync').resolves({});
			const mockSaveCurrentState = sinon.stub(ChromeStore.prototype, 'saveCurrentState');

			cs = new ChromeStore('local');
			expect(cs).not.toBeNull();

			mockSync.restore();
			mockSaveCurrentState.restore();
		});

		it('should initialize with remote', () => {
		});
	});

	describe('[Method] get', () => {
		let cs;
		beforeEach(() => {
			cs = new ChromeStore('local');
		});
	});
});
