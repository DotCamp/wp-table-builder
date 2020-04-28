const gulp = require('gulp');
const watch = require('gulp-watch');
const sourcemaps = require('gulp-sourcemaps');
const babel = require('gulp-babel');
const concat = require('gulp-concat');
const uglify = require('gulp-uglify');
const rename = require('gulp-rename');

gulp.task('adminJs', function () {
    gulp.
        src(['./inc/admin/js/core/*.js', './inc/admin/js/core-premium/*.js'])
        .pipe(sourcemaps.init())
        .pipe(babel({
            presets: [['env', { modules: false }]],
            babelrc: false
        }))
        .pipe(concat('./inc/admin/js/admin.js'))
        .pipe(sourcemaps.write('.'))
        .pipe(gulp.dest('.'))
});

gulp.task('minify', function () {
    gulp.
        src('./inc/admin/js/admin.js')
        .pipe(uglify())
        .pipe(rename('admin.min.js'))
        .pipe(gulp.dest('./inc/admin/js/'))
});

gulp.task('watch', function () {
    gulp.watch(['./inc/admin/js/core/*.js', './inc/admin/js/core-premium/*.js'], ['adminJs']);
});

gulp.task('default', ['adminJs']);