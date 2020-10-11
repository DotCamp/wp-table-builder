const gulp = require('gulp');
const sourcemaps = require('gulp-sourcemaps');
const babel = require('gulp-babel');
const concat = require('gulp-concat');
const uglify = require('gulp-uglify');

gulp.task('adminJs', function () {
	gulp.src(['./inc/admin/js/core/*.js', './inc/admin/js/core-premium/*.js'])
		.pipe(sourcemaps.init())
		.pipe(
			babel({
				presets: [['env', { modules: false }]],
				babelrc: false,
			})
		)
		.pipe(concat('./inc/admin/js/admin.js'))
		.pipe(uglify())
		.pipe(sourcemaps.write('.'))
		.pipe(gulp.dest('.'));
});

gulp.task('minify', function () {
	gulp.src('./inc/admin/js/admin.js').pipe(uglify()).pipe(gulp.dest('./inc/admin/js/'));
});

gulp.task('frontendJs', function () {
	gulp.src([
		'./inc/admin/js/core/WPTB_CutGlueTable.js',
		'./inc/admin/js/core/WPTB_SortableTable.js',
		'./inc/admin/js/core/WPTB_RecalculateIndexes.js',
		'./inc/admin/js/WPTB_ResponsiveFrontend.js',
		'./inc/frontend/js/frontend-only/wp-table-builder-frontend.js',
	])
		.pipe(sourcemaps.init())
		.pipe(
			babel({
				presets: [['env', { modules: false }]],
				babelrc: false,
			})
		)
		.pipe(concat('./inc/frontend/js/wp-table-builder-frontend.js'))
		.pipe(uglify())
		.pipe(sourcemaps.write('.'))
		.pipe(gulp.dest('.'));
});

gulp.task('watch', function () {
	gulp.watch(
		['./inc/admin/js/core/*.js', './inc/admin/js/core-premium/*.js', './inc/admin/js/WPTB_ResponsiveFrontend.js'],
		['adminJs']
	);
	gulp.watch(
		[
			'./inc/admin/js/core/WPTB_CutGlueTable.js',
			'./inc/admin/js/core/WPTB_SortableTable.js',
			'./inc/admin/js/core/WPTB_RecalculateIndexes.js',
			'./inc/frontend/js/frontend-only/wp-table-builder-frontend.js',
			'./inc/admin/js/WPTB_ResponsiveFrontend.js',
		],
		['frontendJs']
	);
});

gulp.task('default', ['adminJs', 'frontendJs']);
