const gulp = require('gulp');
const watch = require('gulp-watch');
const sourcemaps = require('gulp-sourcemaps');
const babel = require('gulp-babel');
const concat = require('gulp-concat');

gulp.task('adminJs', function () {
    gulp.
        src('./inc/admin/js/core/*.js')
        .pipe(sourcemaps.init())
        .pipe(babel({
            presets: [['env', { modules: false }]]
        }))
        .pipe(concat('./inc/admin/js/admin.js'))
        .pipe(sourcemaps.write('.'))
        .pipe(gulp.dest('.'))
});


gulp.task('watch', function () {
    gulp.watch('./inc/admin/js/core/*.js', ['adminJs']);
});

gulp.task('default', ['adminJs']);