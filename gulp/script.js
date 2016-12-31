'use strict';

module.exports = (deps, config) => {
	const gulp       = deps.gulp;
	const plumber    = deps.plumber;
	const babel      = deps.babel;
	const sourcemaps = deps.sourcemaps;
	const ts         = deps.ts;

	const tsProject = ts.createProject('tsconfig.json');

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


	gulp.task('ts:srv', () => {
		return gulp.src(['./src/**/*.ts'])
			.pipe(plumber())
			.pipe(tsProject())
			.js.pipe(gulp.dest('./build/srv/'));
	});

	gulp.task('ts:dist', () => {
		return gulp.src(['./src/**/*.ts'])
			.pipe(plumber())
			.pipe(tsProject())
			.js.pipe(babel({
				presets: ['babili']
			}))
			.pipe(gulp.dest('./build/dist/'));
	});
};
