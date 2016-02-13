var gulp = require("gulp");
var util = require("gulp-util");
var coffee = require('gulp-coffee');
var concat = require('gulp-concat');
var uglify = require('gulp-uglify');
var cssnano = require('gulp-cssnano');
var imagemin = require('gulp-imagemin');
var sourcemaps = require('gulp-sourcemaps');
var print = require('gulp-print');

var runSequence = require('run-sequence');

var del = require('del');
var colors = require('colors');

//\\//\\//\\//\\//\\//\\//\\//\\//\\//\\//\\//\\//\\//\\//\\//\\

var paths = {
    javascripts: 'public/javascripts/**/*.js',
    stylesheets: 'public/stylesheets/**/*.css',
    dist: 'public/dist',
    minifiedJavascript: 'main.min.js',
    minifiedStylesheet: 'main.min.css'
};

//\\//\\//\\//\\//\\//\\//\\//\\//\\//\\//\\//\\//\\//\\//\\//\\

gulp.task('clean', () =>
    del([paths.dist]).then(paths => {
        if(paths && paths.length && paths.length > 0) {
    	    util.log(' => Deleted files and folders :'.green);
    	    paths.forEach(path => util.log(path.red));
        }
    	util.log(' => Already clean !'.green);
    })
);

//\\//\\//\\//\\//\\//\\//\\//\\//\\//\\//\\//\\//\\//\\//\\//\\

gulp.task('build-js', () =>
    gulp.src(paths.javascripts)
        .pipe(print(file => '    Javascript file: ' + file))
        .pipe(sourcemaps.init())
        .pipe(uglify())
        .pipe(concat(paths.minifiedJavascript))
        .pipe(sourcemaps.write())
        .pipe(gulp.dest(paths.dist))
        .on('end', () => util.log(' => Minified javascript file has been created.'.green))
);

//\\//\\//\\//\\//\\//\\//\\//\\//\\//\\//\\//\\//\\//\\//\\//\\

gulp.task('build-css', () =>
    gulp.src(paths.stylesheets)
        .pipe(print(file => '    Stylesheet file: ' + file))
        .pipe(sourcemaps.init())
        .pipe(cssnano())
        .pipe(concat(paths.minifiedStylesheet))
        .pipe(sourcemaps.write())
        .pipe(gulp.dest(paths.dist))
        .on('end', () => util.log(' => Minified stylesheet file has been created.'.green))
);

//\\//\\//\\//\\//\\//\\//\\//\\//\\//\\//\\//\\//\\//\\//\\//\\

gulp.task('build', ['clean'], () =>
    runSequence('build-js', 'build-css')
);

//\\//\\//\\//\\//\\//\\//\\//\\//\\//\\//\\//\\//\\//\\//\\//\\

gulp.task('watch', () => {
    gulp.watch(paths.javascripts, ['build-js']);
    gulp.watch(paths.stylesheets, ['build-css']);
});

//\\//\\//\\//\\//\\//\\//\\//\\//\\//\\//\\//\\//\\//\\//\\//\\

gulp.task('default', ['build', 'watch'], () => {
    // Nothing !
});

//\\//\\//\\//\\//\\//\\//\\//\\//\\//\\//\\//\\//\\//\\//\\//\\







