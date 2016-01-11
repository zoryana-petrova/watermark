'use strict';

var gulp = require("gulp"),
    browserSync = require("browser-sync").create(),
    jade = require('gulp-jade'),
    compass = require('gulp-compass'),
    plumber = require('gulp-plumber'),
    autoprefixer = require('gulp-autoprefixer'),
    uglify = require('gulp-uglify'),
    useref = require('gulp-useref'),
    minifyCss = require('gulp-minify-css'),
    gulpIf = require('gulp-if'),
    imagemin = require('gulp-imagemin'),
    rimraf = require('rimraf'),
    browserify = require('gulp-browserify'),
    rename = require('gulp-rename');

var compassConfig = {
    config_file: 'config.rb',
    css: 'app/css',
    sass: 'app/scss',
    image: 'app/img',
    sourcemap: true
};

gulp.task('server', function () {
    browserSync.init({
        port: 9000,
        server: {
            baseDir: 'app'
        }
    });
});

gulp.task('sass', function () {
    gulp.src('app/scss/main.scss')
        .pipe(plumber())
        .pipe(compass(compassConfig));
});

gulp.task('jade', function () {
    var YOUR_LOCALS = {
        staticX: 'destroyAll'
    };

    gulp.src('app/jade/*.jade')
        .pipe(plumber())
        .pipe(jade({
            locals: YOUR_LOCALS,
            pretty: true
        }))
        .pipe(gulp.dest('app/'));
});

gulp.task('watch', function () {
    gulp.watch('app/scss/**/*.scss', ['sass']);
    gulp.watch('app/jade/**/*.jade', ['jade']);
    gulp.watch('app/js/main.js', ['scripts']);
    gulp.watch('app/js/modules/*.js', ['scripts']);
    gulp.watch([
        'app/*.html',
        'app/js/bundle.js',
        'app/css/*.css'
    ]).on('change', browserSync.reload);
});

gulp.task('default', ['server', 'watch']);

gulp.task('assets', ['sass', 'jade', 'scripts'], function () {
    return gulp.src('app/*.html')
        .pipe(useref())

        .pipe(gulpIf('*.css', autoprefixer({
            browsers: ['last 2 versions'],
            cascade: false
        })))
        .pipe(gulpIf('*.css', minifyCss({compatibility: 'ie9'})))

        .pipe(gulpIf('*.js', uglify()))
        .pipe(gulp.dest('dist/'));
});

gulp.task('images', function () {
    return gulp.src('app/img/*.+(png|jpg|jpeg|gif|svg)')
        .pipe(imagemin({
            progressive: true,
            interlaced: true
        }))
        .pipe(gulp.dest('dist/img/'));
});

gulp.task('fonts', function () {
    return gulp.src('app/fonts/**/*.+(eot|svg|ttf|woff|woff2)')
        .pipe(gulp.dest('dist/fonts'));
});

gulp.task('favicon', function () {
    return gulp.src('app/*.+(ico|png)')
        .pipe(gulp.dest('dist/'));
});

gulp.task('uploads', function () {
    return gulp.src('app/uploads/**/*.+(png|jpg|jpeg|gif|svg)')
        .pipe(gulp.dest('dist/uploads/'));
});

gulp.task('clean', function (cb) {
    rimraf('dist', cb);
});

gulp.task('dist', ['assets', 'images', 'fonts', 'favicon', 'uploads']);

gulp.task('build', ['clean'], function () {
    console.log('Building files');

    compassConfig.sourcemap = false;

    gulp.start('dist');
});


gulp.task('scripts', function () {
    gulp.src('app/js/main.js')
        .pipe(plumber())
        .pipe(browserify())
        .pipe(rename('bundle.js'))
        .pipe(gulp.dest('app/js'))
});