'use strict';

module.exports = (deps, config) => {
	const gulp     = deps.gulp;
	const plumber  = deps.plumber;
	const imagemin = deps.imagemin;

	config.envs.forEach((env) => {
		gulp.task(`assets:${env}`, () => {
			return gulp.src(['./src/assets/**/*', '!images/'])
				.pipe(plumber())
				.pipe(gulp.dest(`./build/${env}/assets/`));
		});
	});

	gulp.task('images:srv', () => {
		return gulp.src(['./src/assets/images/**/*'])
			.pipe(plumber())
			.pipe(gulp.dest('./build/srv/assets/'));
	});

	gulp.task('images:dist', () => {
		return gulp.src(['./src/assets/images/**/*'])
			.pipe(plumber())
			.pipe(imagemin())
			.pipe(gulp.dest('./build/dist/assets/'));
	});
};
