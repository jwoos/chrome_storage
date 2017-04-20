module.exports = (config) => {
	config.set({
		basePath: './',
		frameworks: ['jasmine', 'sinon-chrome', 'karma-typescript'],
		plugins: [
			'karma-coverage',
			'karma-chrome-launcher',
			'karma-phantomjs-launcher',
			'karma-sinon',
			'karma-sinon-chrome',
			'karma-jasmine',
			'karma-typescript'
		],
		include: [],
		exclude: [],
		files: [
			'src/*.ts'
		],
		preprocessors: {
			'src/!(.spec).ts': ['karma-typescript', 'coverage'],
			'src/*.ts': ['karma-typescript']
		},
		reporters: ['progress', 'karma-typescript'],
		singleRun: true,
		colors: true,
		// change to Chrome headless when it hits stable
		browsers: [
			'ChromeNoSandBox',
			//'PhantomJS'
		],
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
			ChromeNoSandBox: {
				base: 'Chrome',
				flags: [
					'--no-sandbox'
				]
			}
		},
		karmaTypescriptConfig: {
			compilerOptions: {
				tsconfig: './tsconfig.json',
			},
			reports: {
				lcovonly: {
					filename: 'lcov.info',
					directory: './coverage'
				}
			}
		},
		//logLevel: 'debug'
		browserConsoleLogOptions: {
			terminal: true,
			level: 'log'
		}
	});
};
