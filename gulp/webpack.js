'use strict';

module.exports = (deps, config) => {
	const gulp       = deps.gulp;
	const plumber    = deps.plumber;
	const webpack    = deps.webpack;
	const wp         = deps.wp;
	const babel      = deps.babel;
	const path       = deps.path;
	const sourcemaps = deps.sourcemaps;

	const webpackConfig = {
		entry: {
			'index': './src/index.ts',
		},
		context: path.resolve(__dirname, '..'),
		devtool: 'source-map',
		resolve: {
			extensions: ['.js', '.ts'],
			modules: [path.resolve(__dirname, 'src'), 'node_modules', 'bower_components']
		},
		resolveLoader: {
			modules: ['node_modules']
		},
		output: {
			filename: '[name].js'
		},
		target: 'web',
		module: {
			rules: [
				{
					test: /\.json$/,
					use: 'json-loader'
				},
				{
					test: /\.ts$/,
					use: 'ts-loader?transpileOnly=true'
					// FIXME awesome-ts-loader hangs, use ts-loader for now
					// use: 'awesome-typescript-loader'
				},
				{
					test: /\.js$/,
					use: [
						{
							loader: 'babel-loader',
							options: {
								presets: ['babili'],
								cacheDirectory: ['.srv/babel/']
							}
						}
					],
					exclude: /(node_modules|bower_components)/
				}
			]
		},
		plugins: [
			new wp.LoaderOptionsPlugin({
				minimize: true,
				debug: false
			})
		],
		stats: {
			//assets: false,
			//assetsSort: "field",
			cached: false,
			children: true,
			chunks: true,
			chunkModules: true,
			chunkOrigins: true,
			//chunksSort: "field",
			//context: "../src/",
			errors: true,
			errorDetails: true,
			hash: true,
			modules: true,
			//modulesSort: "field",
			//publicPath: true,
			reasons: false,
			source: true,
			timings: false,
			version: true,
			warnings: true
		}
	};

	gulp.task('webpack:srv', () => {
		return gulp.src(['./src/scripts/*.ts'])
			.pipe(plumber())
			.pipe(webpack(webpackConfig, wp))
			.pipe(gulp.dest('./build/srv/scripts/'));
	});

	gulp.task('webpack:dist', () => {
		return gulp.src(['./src/scripts/*.ts'])
			.pipe(plumber())
			.pipe(webpack(webpackConfig, wp))
			.pipe(babel({
				presets: ['babili'],
				ignore: '*.js.map'
			}))
			.pipe(gulp.dest('./build/dist/scripts/'));
	});
};
