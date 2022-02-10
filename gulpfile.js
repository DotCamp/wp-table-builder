const gulp = require('gulp');
const sourcemaps = require('gulp-sourcemaps');
const autoprefixer = require('gulp-autoprefixer');
const csso = require('gulp-csso');
const babel = require('gulp-babel');
const concat = require('gulp-concat');
const uglify = require('gulp-uglify');
const sass = require('gulp-sass')(require('sass'));
const gulpif = require('gulp-if');
const path = require('path');

/**
 * Gulp configuration object for path locations.
 *
 * @type {Object}
 */
const gulpConfig = {
	adminJs: {
		src: [
			'./inc/admin/js/core/*.js',
			'./inc/admin/js/core-premium/*.js',
			'./inc/admin/js/core/rollup-source/WPTB_IconManager.js',
		],
		dest: '.',
	},
	frontEndJs: {
		src: [
			'./inc/admin/js/core/WPTB_ExtraStyles.js',
			'./inc/admin/js/core/WPTB_Logger.js',
			'./inc/admin/js/core/WPTB_CutGlueTable.js',
			'./inc/admin/js/core/WPTB_GetDirectionAfterReconstruction.js',
			'./inc/admin/js/core/WPTB_SortableTable.js',
			'./inc/admin/js/core/WPTB_RecalculateIndexes.js',
			'./inc/admin/js/WPTB_ResponsiveFrontend.js',
			'./inc/frontend/js/frontend-only/WPTB_StylePass.js',
			'./inc/frontend/js/frontend-only/WPTB_LazyLoad.js',
			'./inc/frontend/js/frontend-only/WPTB_ScrollManager.js',
			'./inc/frontend/js/frontend-only/wp-table-builder-frontend.js',
		],
		dest: './inc/frontend/js/wp-table-builder-frontend.js',
	},
	adminCss: {
		src: ['./inc/admin/css/src/*.css', '!./inc/admin/css/src/admin.css'],
		dest: './inc/admin/css',
	},
	adminSass: {
		src: ['./inc/admin/css/src/*.scss', '!./inc/admin/css/src/admin.scss'],
		dest: './inc/admin/css',
	},
	onlyAdminCss: {
		src: ['./inc/admin/css/src/admin.css', './inc/admin/js/WPTB_BuilderControls.css'],
		dest: './inc/admin/css/admin.css',
	},
	onlyAdminSass: {
		src: ['./inc/admin/css/src/admin.scss', './inc/admin/js/WPTB_BuilderControls.css'],
		dest: './inc/admin/css/admin.css',
	},
};

function adminJs() {
	return gulp
		.src(gulpConfig.adminJs.src, { allowEmpty: true })
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
		.pipe(gulp.dest(gulpConfig.adminJs.dest));
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
	return gulp
		.src(gulpConfig.adminCss.src)
		.pipe(autoprefixer())
		.pipe(csso())
		.pipe(gulp.dest(gulpConfig.adminCss.dest));
}

function adminSass() {
	return gulp
		.src(gulpConfig.adminSass.src)
		.pipe(sass({ outputStyle: 'compressed' }).on('error', sass.logError))
		.pipe(gulp.dest(gulpConfig.adminSass.dest));
}

function onlyCssAdmin() {
	return gulp
		.src(gulpConfig.onlyAdminCss.src)
		.pipe(autoprefixer())
		.pipe(concat(gulpConfig.onlyAdminCss.dest))
		.pipe(csso())
		.pipe(gulp.dest('.'));
}

function onlyAdminSass() {
	const filter = (file) => {
		return path.parse(file.path).ext === '.scss';
	};

	return gulp
		.src(gulpConfig.onlyAdminSass.src)
		.pipe(gulpif(filter, sass({ outputStyle: 'compressed' }).on('error', sass.logError)))
		.pipe(autoprefixer())
		.pipe(concat(gulpConfig.onlyAdminSass.dest))
		.pipe(gulp.dest('.'));
}

function cssFrontend() {
	return gulp
		.src(['./inc/frontend/css/src/*.css'])
		.pipe(autoprefixer())
		.pipe(csso())
		.pipe(gulp.dest('./inc/frontend/css'));
}

exports.watch = gulp.parallel(
	async function watchAdminJs() {
		await adminJs();
		return gulp.watch(gulpConfig.adminJs.src, adminJs);
	},
	async function watchFrontendJs() {
		await frontendJs();
		return gulp.watch(gulpConfig.frontEndJs.src, frontendJs);
	},
	async function watchAdminStyles() {
		await cssAdmin();
		return gulp.watch(['./inc/admin/css/src/*.css'], cssAdmin);
	},
	async function watchAdminSass() {
		await adminSass();
		return gulp.watch(gulpConfig.adminSass.src, adminSass);
	},
	async function watchOnlyAdminSass() {
		await onlyAdminSass();
		return gulp.watch(gulpConfig.onlyAdminSass.src, onlyAdminSass);
	},
	async function watchFrontendStyles() {
		await cssFrontend();
		return gulp.watch(['./inc/frontend/css/src/*.css'], cssFrontend);
	}
);

exports.default = gulp.parallel(adminJs, frontendJs, cssAdmin, adminSass, onlyAdminSass, cssFrontend);
