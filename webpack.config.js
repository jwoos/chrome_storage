const path = require('path');

module.exports = {
	entry: './index.ts',
	output: {
		path: path.resolve(__dirname, 'build'),
		filename: 'chromestore.js',
		library: 'ChromeStore',
		libraryTarget: 'window'
	},
	module: {
		rules: [
			{
				test: /\.ts$/,
				include: [
					path.resolve(__dirname, 'src'),
					path.resolve(__dirname, 'node_modules')
				],
				exclude: [
					/\.spec\.ts$/,
					/archive/
				],
				loader: 'awesome-typescript-loader',
			}
		]
	},
	resolve: {
		modules: [
			path.resolve(__dirname, 'node_modules'),
			path.resolve(__dirname, 'src')
		],
		extensions: ['.js', '.ts']
	},
	devtool: 'source-map',
	context: path.resolve(__dirname, 'src'),
	target: 'web',
	stats: {
		assets: true,
		colors: true,
		errors: true,
		errorDetails: true,
		hash: true
	},
	cache: true
};
