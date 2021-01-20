const gulp = require('gulp');
const sourcemaps = require('gulp-sourcemaps');
const autoprefixer = require('gulp-autoprefixer');
const csso = require('gulp-csso');
const babel = require('gulp-babel');
const concat = require('gulp-concat');
const uglify = require('gulp-uglify');

const gulpConfig = {
	frontEndJs: {
		src: [
			'./inc/admin/js/core/WPTB_Logger.js',
			'./inc/admin/js/core/WPTB_CutGlueTable.js',
			'./inc/admin/js/core/WPTB_GetDirectionAfterReconstruction.js',
			'./inc/admin/js/core/WPTB_SortableTable.js',
			'./inc/admin/js/core/WPTB_RecalculateIndexes.js',
			'./inc/admin/js/WPTB_ResponsiveFrontend.js',
			'./inc/frontend/js/frontend-only/WPTB_StylePass.js',
			'./inc/frontend/js/frontend-only/wp-table-builder-frontend.js',
		],
		dest: './inc/frontend/js/wp-table-builder-frontend.js',
	},
};

function adminJs() {
	return gulp
		.src(['./inc/admin/js/core/*.js', './inc/admin/js/core-premium/*.js'])
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
}

function minify() {
	gulp.src('./inc/admin/js/admin.js').pipe(uglify()).pipe(gulp.dest('./inc/admin/js/'));
}

function frontendJs() {
	return gulp
		.src(gulpConfig.frontEndJs.src)
		.pipe(sourcemaps.init())
		.pipe(
			babel({
				presets: [['@babel/env', { modules: false }]],
				plugins: ['@babel/plugin-proposal-object-rest-spread'],
				babelrc: false,
			})
		)
		.pipe(concat(gulpConfig.frontEndJs.dest))
		.pipe(uglify())
		.pipe(sourcemaps.write('.'))
		.pipe(gulp.dest('.'));
}

function cssAdmin() {
	return gulp.src(['./inc/admin/css/src/*.css']).pipe(autoprefixer()).pipe(csso()).pipe(gulp.dest('./inc/admin/css'));
}

function cssFrontend() {
	return gulp
		.src(['./inc/frontend/css/src/*.css'])
		.pipe(autoprefixer())
		.pipe(csso())
		.pipe(gulp.dest('./inc/frontend/css'));
}

exports.watch = gulp.parallel(
	function watchAdminJs() {
		return gulp.watch(
			[
				'./inc/admin/js/core/*.js',
				'./inc/admin/js/core-premium/*.js',
				'./inc/admin/js/WPTB_ResponsiveFrontend.js',
			],
			adminJs
		);
	},
	function watchFrontendJs() {
		return gulp.watch(gulpConfig.frontEndJs.src, frontendJs);
	},
	function watchAdminStyles() {
		return gulp.watch(['./inc/admin/css/src/*.css'], cssAdmin);
	},
	function watchFrontendStyles() {
		return gulp.watch(['./inc/frontend/css/src/*.css'], cssFrontend);
	}
);

exports.default = gulp.parallel(adminJs, frontendJs, cssAdmin, cssFrontend);
