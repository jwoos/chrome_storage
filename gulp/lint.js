'use strict';

module.exports = (deps, config) => {
	const gulp    = deps.gulp;
	const plumber = deps.plumber;
	const tslint  = deps.tslint;
	const eslint  = deps.eslint;

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
};
