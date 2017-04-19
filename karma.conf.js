module.exports = (config) => {
	config.set({
		basePath: './',
		frameworks: ['jasmine', 'karma-typescript'],
		include: [
			'src/*.ts'
		],
		plugins: [
			'karma-chrome-launcher',
			'karma-phantomjs-launcher',
			'karma-coverage',
			'karma-jasmine',
			'karma-typescript'
		],
		colors: true,
		exclude: [],
		files: [
			'test/unit/*.ts'
		],
		preprocessors: {
			'**/*.ts': ['karma-typescript']
		},
		reporters: ['progress', 'coverage', 'karma-typescript'],
		singleRun: true,
		colors: true,
		// change to Chrome headless when it hits stable
		browsers: ['PhantomJS'],
		customLaunchers: {
			ChromeHeadless: {
				base: 'Chrome',
				flags: [
					'--no-sandbox',
					// See https://chromium.googlesource.com/chromium/src/+/lkgr/headless/README.md
					'--headless',
					'--disable-gpu',
					// Without a remote debugging port, Google Chrome exits immediately.
					' --remote-debugging-port=9222',
				],
			},
		},
	});
};
