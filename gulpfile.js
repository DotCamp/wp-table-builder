const gulp = require('gulp');
const sourcemaps = require('gulp-sourcemaps');
const autoprefixer = require('gulp-autoprefixer');
const csso = require('gulp-csso');
const babel = require('gulp-babel');
const concat = require('gulp-concat');
const uglify = require('gulp-uglify');

gulp.task('adminJs', function () {
	gulp.src(['./inc/admin/js/core/*.js', './inc/admin/js/core-premium/*.js'])
		.pipe(sourcemaps.init())
		.pipe(
			babel({
				presets: [['@babel/env', { modules: false }]],
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
				presets: [['@babel/env', { modules: false }]],
				plugins: ['@babel/plugin-proposal-object-rest-spread'],
				babelrc: false,
			})
		)
		.pipe(concat('./inc/frontend/js/wp-table-builder-frontend.js'))
		.pipe(uglify())
		.pipe(sourcemaps.write('.'))
		.pipe(gulp.dest('.'));
});

gulp.task('cssAdmin', () => {
	gulp.src(['./inc/admin/css/src/*.css']).pipe(autoprefixer()).pipe(csso()).pipe(gulp.dest('./inc/admin/css'));
});

gulp.task('cssFrontend', () => {
	gulp.src(['./inc/frontend/css/src/*.css']).pipe(autoprefixer()).pipe(csso()).pipe(gulp.dest('./inc/frontend/css'));
});

gulp.task('watch', () => {
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

	gulp.watch(['./inc/admin/css/src/*.css'], ['cssAdmin']);
	gulp.watch(['./inc/frontend/css/src/*.css'], ['cssFrontend']);
});

gulp.task('default', ['adminJs', 'frontendJs', 'cssAdmin', 'cssFrontend']);
