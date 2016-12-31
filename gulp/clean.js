'use strict';

module.exports = (deps, config) => {
	const gulp = deps.gulp;
	const del  = deps.del;

	config.envs.forEach((env) => {
		gulp.task(`clean:${env}`, () => {
			return del([`build/${env}/**/*`]);
		});
	});
};
