// Gulp.js configuration
'use strict';

var gulp = require('gulp');
var sass = require('gulp-sass');
var plumber = require('gulp-plumber');
var babel = require('gulp-babel');
var notify = require('gulp-notify');
var autoprefixer = require('gulp-autoprefixer');
var sourcemaps = require('gulp-sourcemaps');
var imagemin = require('gulp-imagemin');
var jshint = require('gulp-jshint');
var uglify = require('gulp-uglify');
var cssnano = require('gulp-cssnano');
var concat = require('gulp-concat');
var connect = require('gulp-connect-php');
var browserSync = require('browser-sync');
var plumberErrorHandler = {
    errorHandler: notify.onError({
        title: 'Gulp',
        message: 'Error: <%= error.message %>'
    })
};

gulp.task('sass', function () {
    gulp.src('./assets/styles/src/*.scss')
    .pipe(plumber(plumberErrorHandler))
    .pipe(sourcemaps.init())
    .pipe(sass())
    .pipe(autoprefixer())
    .pipe(gulp.dest('./assets/styles/build'))
    .pipe(cssnano())
    .pipe(concat('style.min.css'))
    .pipe(sourcemaps.write('.'))
    .pipe(gulp.dest('./assets/styles/build'))
    .pipe(browserSync.stream({ match: './assets/styles/build/*.css' }));
});

gulp.task('scripts', function () {
    gulp.src('./assets/scripts/src/*.js')
    .pipe(plumber(plumberErrorHandler))
    .pipe(babel())
    .pipe(jshint())
    .pipe(gulp.dest('./assets/scripts/build'))
    .pipe(uglify())
    .pipe(concat('scripts.min.js'))
	.pipe(gulp.dest('./assets/scripts/build'));
});
 
gulp.task('images', function () {
    gulp.src('./assets/images/src/*')
    .pipe(imagemin())
    .pipe(gulp.dest('./assets/images/build'))
});

gulp.task('connect-sync', function () {
    connect.server({}, function () {
        browserSync({
            proxy: 'sandbox.local'
        });
    });
});

gulp.task('watch', function() {
    gulp.watch('assets/styles/src/**/*.scss', ['sass']).on('change', browserSync.reload);
    gulp.watch('assets/scripts/src/**/*.js', ['scripts']).on('change', browserSync.reload);
    gulp.watch('assets/images/src/*', ['images']);
});

gulp.task('default', ['sass', 'connect-sync', 'scripts', 'images', 'watch']);