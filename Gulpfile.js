'use strict';

const gulp = require('gulp');

const childProcess = require('child_process');
const fs = require('fs');
const path = require('path');

const atl = require('awesome-typescript-loader');
const babel = require('gulp-babel');
const colors = require('colors/safe');
const del = require('del');
const eslint = require('gulp-eslint');
const imagemin = require('gulp-imagemin');
const mergeStream = require('merge-stream');
const plumber = require('gulp-plumber');
const sass = require('gulp-sass');
const sourcemaps = require('gulp-sourcemaps');
const ts = require('gulp-typescript');
const tslint = require('gulp-tslint');
const webpack = require('webpack-stream');
const wp = require('webpack');

const config = {
	envs: ['srv', 'dist']
};

const tsProject = ts.createProject('tsconfig.json');

config.envs.forEach((env) => {
	gulp.task(`init:${env}`, () => {
		return new Promise((resolve, reject) => {
			childProcess.exec(`if [[ ! -d build/${env} ]]; then mkdir build/${env}; fi`, (e) => {
				e ? reject() : resolve();
			});
		});
	});

	gulp.task(`copy:${env}`, () => {
		return gulp.src(['./manifest.json'])
			.pipe(plumber())
			.pipe(gulp.dest(`./build/${env}/`));
	});

	gulp.task(`clean:${env}`, () => {
		return del([`build/${env}/**/*`]);
	});
});

gulp.task('tslint', () => {
	return gulp.src(['./src/**/*.ts'])
		.pipe(plumber())
		.pipe(tslint({
			formatter: 'verbose'
		}))
		.pipe(tslint.report({
			emitError: false
		}));
});

gulp.task('eslint', () => {
	return gulp.src(['./src/scripts/*.js'])
		.pipe(plumber())
		.pipe(eslint({
			eslint: '.eslintrc.json'
		}))
		.pipe(eslint.format());
});

gulp.task('js:srv', () => {
	return gulp.src(['./src/**/*.js'])
		.pipe(plumber())
		.pipe(gulp.dest('./build/srv/'));
});

gulp.task('js:dist', () => {
	return gulp.src(['./src/**/*.js'])
		.pipe(plumber())
		.pipe(sourcemaps.init())
		.pipe(babel({
			presets: ['babili']
		}))
		.pipe(sourcemaps.write('.'))
		.pipe(gulp.dest('./build/dist/'));
});

gulp.task('ts:test', () => {
	return gulp.src(['./test/**/*.ts', './src/**/*.ts', '!./src/archive/*.ts'])
		.pipe(plumber())
		.pipe(tsProject())
		.js.pipe(gulp.dest('./build/test/'));
});

gulp.task('ts:srv', () => {
	return gulp.src(['./src/**/*.ts', '!./src/archive/*.ts'])
		.pipe(plumber())
		.pipe(tsProject())
		.js.pipe(gulp.dest('./build/srv/'));
});

gulp.task('ts:dist', () => {
	return gulp.src(['./src/**/*.ts', '!./src/archive/*.ts'])
		.pipe(plumber())
		.pipe(tsProject())
		.js.pipe(babel({
			presets: ['babili']
		}))
		.pipe(gulp.dest('./build/dist/'));
});

gulp.task('srv', gulp.series('init:srv', 'clean:srv', 'tslint', 'ts:srv'));
gulp.task('default', gulp.series('srv'));

gulp.task('dist', gulp.series('init:dist', 'clean:dist', 'tslint', 'ts:dist'));
