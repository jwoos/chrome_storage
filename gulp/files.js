'use strict';

module.exports = (deps, config) => {
	const gulp    = deps.gulp;
	const plumber = deps.plumber;

	config.envs.forEach((env) => {
		gulp.task(`copy:${env}`, () => {
			return gulp.src(['./manifest.json'])
				.pipe(plumber())
				.pipe(gulp.dest(`./build/${env}/`));
		});
	});
};
