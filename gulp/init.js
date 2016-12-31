'use strict';

module.exports = (deps, config) => {
	const gulp         = deps.gulp;
	const childProcess = deps.childProcess;

	config.envs.forEach((env) => {
		gulp.task(`init:${env}`, () => {
			return new Promise((resolve, reject) => {
				childProcess.exec(`if [ ! -d build/${env} ]; then mkdir build/${env}; fi`, (e) => {
					e ? reject() : resolve();
				});
			});
		});
	});
};
