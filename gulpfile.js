/**
 * Created by aleksejs.gordejevs on 10/20/2016.
 */

'use strict';

const {series, task, src, dest} = require('gulp');
const pathToLib = './lib/';
const size = require('gulp-filesize');
const uglify = require('gulp-uglify');
const rename = require('gulp-rename');
const rimraf = require('gulp-rimraf');
const jshint = require('gulp-jshint');
const gulpFilter = require('gulp-filter');

task('clean-js', function () {
    const filter = gulpFilter(['**/*.min.js', '**/*.js.map']);
    return src(pathToLib + '**', {read: false})
        .pipe(filter)
        .pipe(rimraf({force: true}));
});

task('uglify-js', series('clean-js', function () {
    const filter = gulpFilter(['*/*.js', '!*.min.js']);
    return src(pathToLib + '*')
        .pipe(filter)
        // .pipe(sourcemaps.init({loadMaps: true}))
        .pipe(uglify({
            mangle: false,
            preserveComments: 'license'
        }))
        .pipe(rename({suffix: '.min'}))
        .pipe(size())
        // .pipe(sourcemaps.write('./'))
        .pipe(dest(pathToLib));
}));

task('jshint', function () {
    const filter = gulpFilter(['/*.js', '!*.min.js']);
    return src(pathToLib)
        .pipe(filter)
        .pipe(jshint())
        .pipe(size())
        .pipe(jshint.reporter('default'));
});

task('default', series('jshint', 'uglify-js'));
