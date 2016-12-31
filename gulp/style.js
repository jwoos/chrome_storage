'use strict';

module.exports = (deps, config) => {
	const gulp       = deps.gulp;
	const plumber    = deps.plumber;
	const sourcemaps = deps.sourcemaps;
	const sass       = deps.sass;

	config.envs.forEach((env) => {
		gulp.task(`css:${env}`, () => {
			return gulp.src(['./src/style/**/*.css'])
				.pipe(plumber())
				.pipe(gulp.dest(`./build/${env}/`));
		});
	});

	gulp.task('sass:srv', () => {
		return gulp.src(['./src/style/*.scss'])
			.pipe(plumber())
			.pipe(sourcemaps.init())
			.pipe(sass({
				outputStyle: 'expanded'
			}).on('error', sass.logError))
			.pipe(sourcemaps.write('./'))
			.pipe(gulp.dest('./build/srv/style/'));
	});

	gulp.task('sass:dist', () => {
		return gulp.src(['./src/style/*.scss'])
			.pipe(plumber())
			.pipe(sass({
				outputStyle: 'compressed'
			}).on('error', sass.logError))
			.pipe(gulp.dest('./build/dist/style/'));
	});
};
