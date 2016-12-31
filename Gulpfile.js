'use strict';

const gulp = require('gulp');

const dependencies = {
	gulp: gulp,

	// node built ins
	childProcess: require('child_process'),
	fs: require('fs'),
	path: require('path'),

	atl: require('awesome-typescript-loader'),
	babel: require('gulp-babel'),
	colors: require('colors/safe'),
	del: require('del'),
	eslint: require('gulp-eslint'),
	imagemin: require('gulp-imagemin'),
	mergeStream: require('merge-stream'),
	plumber: require('gulp-plumber'),
	sass: require('gulp-sass'),
	sourcemaps: require('gulp-sourcemaps'),
	ts: require('gulp-typescript'),
	tslint: require('gulp-tslint'),
	webpack: require('webpack-stream'),
	wp: require('webpack'),
};

const config = {
	envs: ['srv', 'dist']
};

// Modular task registration
dependencies.fs.readdirSync('gulp').forEach((module) => {
	require(`./gulp/${module}`)(dependencies, config);
});

gulp.task('srv', gulp.series('init:srv', 'clean:srv', 'tslint', 'ts:srv'));
gulp.task('default', gulp.series('srv'));

gulp.task('dist', gulp.series('init:dist', 'clean:dist', 'tslint', 'ts:dist'));
