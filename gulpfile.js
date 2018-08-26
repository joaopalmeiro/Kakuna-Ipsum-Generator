var gulp = require('gulp'),
    sass = require('gulp-sass'),
    browserSync = require('browser-sync'),
    nodemon = require('gulp-nodemon'),
    autoprefixer = require('gulp-autoprefixer'),
    rename = require('gulp-rename'),
    cssnano = require('gulp-cssnano'),
    sourcemaps = require('gulp-sourcemaps');

var RELOAD_DELAY = 500;

gulp.task('css', function () {
    return gulp.src('style.scss')
        .pipe(sourcemaps.init())
        .pipe(sass().on('error', sass.logError))
        .pipe(autoprefixer('last 4 version'))
        .pipe(gulp.dest('public'))
        .pipe(cssnano())
        .pipe(rename({
            suffix: '.min'
        }))
        .pipe(sourcemaps.write())
        .pipe(gulp.dest('public'))
        .pipe(browserSync.reload({
            stream: true
        }));
});

gulp.task('js', function () {
    return gulp.src('*.js');
});

gulp.task('nodemon', function (cb) {
    var called = false;
    return nodemon({
            script: 'app.js',
            watch: ['app.js']
        })
        .on('start', function onStart() {
            if (!called) {
                cb();
            }
            called = true;
        })
        .on('restart', function onRestart() {
            setTimeout(function reload() {
                browserSync.reload({
                    stream: false
                });
            }, RELOAD_DELAY);
        });
});

gulp.task('browser-sync', ['nodemon'], function () {
    browserSync({
        proxy: 'http://localhost:3000',
        port: 4000,
        browser: 'chrome' // Just 'chrome' (instead of 'google-chrome' or 'google chrome') for Windows
    });
});

gulp.task('bs-reload', function () {
    browserSync.reload();
});

gulp.task('default', ['browser-sync'], function () {
    gulp.watch("*.scss", ['css']);
    gulp.watch('*.js', ['js', browserSync.reload]);
    gulp.watch('public/*.html', ['bs-reload']);
});
