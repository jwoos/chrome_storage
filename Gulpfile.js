'use strict';

const gulp = require('gulp');

const childProcess = require('child_process');

const babel = require('gulp-babel');
const colors = require('colors/safe');
const del = require('del');
const plumber = require('gulp-plumber');
const ts = require('gulp-typescript');
const tslint = require('gulp-tslint');

const config = {
	envs: ['srv', 'dist']
};

const tsProject = ts.createProject('tsconfig.json');

config.envs.forEach((env) => {
	gulp.task(`init:${env}`, () => {
		return new Promise((resolve, reject) => {
			childProcess.exec(`if [[ ! -d build/${env} ]]; then mkdir -p build/${env}; fi`, (e) => {
				e ? reject() : resolve();
			});
		});
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
