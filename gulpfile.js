var gulp = require("gulp");
var util = require("gulp-util");
var coffee = require('gulp-coffee');
var concat = require('gulp-concat');
var uglify = require('gulp-uglify');
var cssnano = require('gulp-cssnano');
var imagemin = require('gulp-imagemin');
var sourcemaps = require('gulp-sourcemaps');
var gprint = require('gulp-print');

var runSequence = require('run-sequence');

var del = require('del');
var colors = require('colors');
var syncExec = require('sync-exec');
var childProcess = require('child_process');

//\\//\\//\\//\\//\\//\\//\\//\\//\\//\\//\\//\\//\\//\\//\\//\\

var paths = {
    javascripts: 'public/javascripts/**/*.js',
    stylesheets: 'public/stylesheets/**/*.css',
    dist: 'public/dist',
    minifiedJavascript: 'main.min.js',
    minifiedStylesheet: 'main.min.css'
};

var config = {
    nodePort: 12345
};

//\\//\\//\\//\\//\\//\\//\\//\\//\\//\\//\\//\\//\\//\\//\\//\\

gulp.task('clean', callback => {
    del([paths.dist]).then(paths => {
        if(paths && paths.length && paths.length > 0) {
            util.log(' => Deleted files and folders :'.green);
            paths.forEach(path => util.log(path.yellow));
        }
        util.log(' => Already clean !'.green);
        callback();
    });
});

//\\//\\//\\//\\//\\//\\//\\//\\//\\//\\//\\//\\//\\//\\//\\//\\

gulp.task('build-js', () =>
    gulp.src(paths.javascripts)
        .pipe(gprint(file => ' -> Javascript file: ' + file))
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
        .pipe(gprint(file => ' ->Stylesheet file: ' + file))
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

var pId;

gulp.task('start', callback => {
    
    if(pId) {
        util.log((' => Node.js is running on pid = ' + pId).red);
        util.log('    First of all, stop that process.'.red);
        return callback();
    }
    
    var child = childProcess.spawn('/usr/local/bin/node', [ './bin/www' ], {
        env: {
            PORT: config.nodePort
        }
    });
    
    pId = child.pid;
    
    child.stdout.on('data', data => process.stdout.write(data));
    child.stderr.on('data', data => process.stderr.write(data));
    
    util.log((' => ' + 'Node.js'.bold + ' started with pid = ' + String(pId).bold + ' :').green);
    
    callback();
});

//\\//\\//\\//\\//\\//\\//\\//\\//\\//\\//\\//\\//\\//\\//\\//\\

gulp.task('stop', callback => {
    if(pId) {
        var res = syncExec('kill ' + pId);
        pId = undefined;
    }
    callback();
});

//\\//\\//\\//\\//\\//\\//\\//\\//\\//\\//\\//\\//\\//\\//\\//\\

gulp.task('restart', callback => {
    if(pId) runSequence('stop', 'start');
    callback();
});

//\\//\\//\\//\\//\\//\\//\\//\\//\\//\\//\\//\\//\\//\\//\\//\\

gulp.task('watch', callback => {
    gulp.watch(paths.javascripts, ['build-js', 'restart']);
    gulp.watch(paths.stylesheets, ['build-css', 'restart']);
    callback();
});

//\\//\\//\\//\\//\\//\\//\\//\\//\\//\\//\\//\\//\\//\\//\\//\\

gulp.task('default', ['build', 'watch', 'start'], callback => {
    util.log(" => Type 'gulp help' for more information.".bold);
    callback(); // Nothing !
});

//\\//\\//\\//\\//\\//\\//\\//\\//\\//\\//\\//\\//\\//\\//\\//\\

gulp.task('help', callback => {
    
    var help = [
        "=============================================".rainbow,
        "",
        " Usage: " + "gulp".bold + " to ...",
        "        " + "gulp COMMAND".bold,
        "",
        " COMMAND".bold + " can be:",
        "",
        "     build  ".bold + "to...",
        "     build  ".bold + "to...",
        "     build  ".bold + "to...",
        "     build  ".bold + "to...",
        "     build  ".bold + "to...",
        "     build  ".bold + "to...",
        "     build  ".bold + "to...",
        "",
        "=============================================".rainbow,
        ];
    
    help.forEach(line => console.log(line));
    callback();
});

//\\//\\//\\//\\//\\//\\//\\//\\//\\//\\//\\//\\//\\//\\//\\//\\







