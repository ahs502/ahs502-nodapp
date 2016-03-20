var gulp = require("gulp");
var util = require("gulp-util");
var coffee = require('gulp-coffee');
var concat = require('gulp-concat');
var uglify = require('gulp-uglify');
var less = require('gulp-less');
var cssnano = require('gulp-cssnano');
var imagemin = require('gulp-imagemin');
var sourcemaps = require('gulp-sourcemaps');
var gprint = require('gulp-print');
var rename = require("gulp-rename");
var merge = require("merge-stream");
var wrapper = require("gulp-wrapper");
var filter = require("gulp-filter");
var file = require("gulp-file");

var runSequence = require('run-sequence');

var path = require('path');
var del = require('del');
var colors = require('colors');
var syncExec = require('sync-exec');
var childProcess = require('child_process');

//\\//\\//\\//\\//\\//\\//\\//\\//\\//\\//\\//\\//\\//\\//\\//\\

function appPath(basePath, extensions, reverse) {
    function subPath(midPath) {
        return extensions.map(extension => path.join(basePath, midPath, '*.' + extension));
    }
    var files = [
        subPath('/'),
        subPath('/*/'),
        subPath('/*/*/'),
        subPath('/*/*/*/'),
        subPath('/*/*/*/*/'),
        subPath('/*/*/*/*/*/'),
        subPath('/*/*/*/*/*/*/'),
        subPath('/*/*/*/*/*/*/*/'),
        subPath('/*/*/*/*/*/*/*/**/')
    ].reduce((total, current, index, array) => total.concat(current), []);
    reverse && files.reverse();
    return files;
}

var config = require("./config.json");
var paths = config.buildPaths;

//\\//\\//\\//\\//\\//\\//\\//\\//\\//\\//\\//\\//\\//\\//\\//\\

gulp.task('clean', callback => {
    del([path.join(paths.dist, '*')]).then(items => {
        if (items && items.length && items.length > 0) {
            util.log(' => Deleted files and folders :'.green);
            items.forEach(item => util.log(item.yellow));
        }
        util.log(' => Already clean !'.green);
        callback();
    });
});

//\\//\\//\\//\\//\\//\\//\\//\\//\\//\\//\\//\\//\\//\\//\\//\\

gulp.task('build-app-js', () => {
    var jsFilter = filter('**/*.js', {
        restore: true
    });
    var coffeeFilter = filter('**/*.coffee', {
        restore: true
    });
    return gulp.src(appPath(paths.app.src, ['js', 'coffee']), {
            base: paths.app.src
        })
        .pipe(jsFilter)
        .pipe(gprint(file => ' -> [' + 'app'.cyan + '] Javascript file: ' + file))
        .pipe(rename({
            extname: '.js'
        }))
        .pipe(jsFilter.restore)
        .pipe(coffeeFilter)
        .pipe(gprint(file => ' -> [' + 'app'.cyan + '] Coffeescript file: ' + file))
        .pipe(coffee({
                bare: false // Each file in a separate IIFE scope
            })
            .on('error', error => {
                util.log(error);
                util.log("\nSTACK: ".red.bold + error.stack);
            }))
        .pipe(rename({
            extname: '.coffee'
        }))
        .pipe(coffeeFilter.restore)
        .pipe(wrapper({
            header: "\n/*\n\tAHS502 : Start of '${filename}'\n*/\n\n",
            footer: "\n\n/*\n\tAHS502 : End of '${filename}'\n*/\n"
        }))
        .pipe(file('introduction.js', "// AHS502 : Application javascript file :"))
        .pipe(concat(paths.app.javascript))
        .pipe(gulp.dest(paths.dist))
        .on('end', () => util.log(' => [' + 'app'.bold.cyan + '] ' + 'Javascript file has been created.'.green))
        // .pipe(sourcemaps.init())
        .pipe(uglify())
        // .pipe(sourcemaps.write()) or .pipe(sourcemaps.write(paths.dist))
        .pipe(rename(paths.app.javascriptMinified))
        .pipe(gulp.dest(paths.dist))
        .on('end', () => util.log(' => [' + 'app'.bold.cyan + '] ' + 'Minified javascript file has been created.'.green))
});

//\\//\\//\\//\\//\\//\\//\\//\\//\\//\\//\\//\\//\\//\\//\\//\\

gulp.task('build-app-css', () => {
    var cssFilter = filter('**/*.css', {
        restore: true
    });
    var lessFilter = filter('**/*.less', {
        restore: true
    });
    return gulp.src(appPath(paths.app.style, ['css', 'less'], true), {
            base: paths.app.style
        })
        .pipe(cssFilter)
        .pipe(gprint(file => ' -> [' + 'app'.cyan + '] Stylesheet file: ' + file))
        .pipe(rename({
            extname: '.css'
        }))
        .pipe(cssFilter.restore)
        .pipe(lessFilter)
        .pipe(gprint(file => ' -> [' + 'app'.cyan + '] Less file: ' + file))
        .pipe(less(
            /*{
                //TODO: Array of paths to be used for @import directives
                paths: [path.join(__dirname, 'less', 'includes')],
                //TODO: Array of less plugins, see: https://www.npmjs.com/package/gulp-less#using-plugins
                plugins: []
            }*/
        ))
        .on('error', error => {
            util.log(error);
            util.log("\nSTACK: ".red.bold + error.stack);
        })
        .pipe(rename({
            extname: '.less'
        }))
        .pipe(lessFilter.restore)
        .pipe(wrapper({
            header: "\n/*\n\tAHS502 : Start of '${filename}'\n*/\n\n",
            footer: "\n\n/*\n\tAHS502 : End of '${filename}'\n*/\n"
        }))
        .pipe(file('introduction.css', "// AHS502 : Application stylesheet file :"))
        .pipe(concat(paths.app.stylesheet))
        .pipe(gulp.dest(paths.dist))
        .on('end', () => util.log(' => [' + 'app'.bold.cyan + '] ' + 'Stylesheet file has been created.'.green))
        // .pipe(sourcemaps.init())
        .pipe(cssnano())
        // .pipe(sourcemaps.write()) or .pipe(sourcemaps.write(paths.dist))
        .pipe(rename(paths.app.stylesheetMinified))
        .pipe(gulp.dest(paths.dist))
        .on('end', () => util.log(' => [' + 'app'.bold.cyan + '] ' + 'Minified stylesheet file has been created.'.green))
});

//\\//\\//\\//\\//\\//\\//\\//\\//\\//\\//\\//\\//\\//\\//\\//\\

gulp.task('build-lib-js', () =>
    gulp.src(paths.lib.js, {
        base: paths.lib.base
    })
    .pipe(gprint(file => ' -> [' + 'lib'.cyan + '] Javascript file: ' + file))
    .pipe(rename({
        extname: '.js'
    }))
    .pipe(wrapper({
        header: "\n/*\n\tAHS502 : Start of '${filename}'\n*/\n\n",
        footer: "\n\n/*\n\tAHS502 : End of '${filename}'\n*/\n"
    }))
    .pipe(file('introduction.js', "// AHS502 : Application libraries javascript file :"))
    .pipe(concat(paths.lib.javascript))
    .pipe(gulp.dest(paths.dist))
    .on('end', () => util.log(' => [' + 'lib'.bold.cyan + '] ' + 'Javascript file has been created.'.green))
    // .pipe(sourcemaps.init())
    .pipe(uglify())
    // .pipe(sourcemaps.write()) or .pipe(sourcemaps.write(paths.dist))
    .pipe(rename(paths.lib.javascriptMinified))
    .pipe(gulp.dest(paths.dist))
    .on('end', () => util.log(' => [' + 'lib'.bold.cyan + '] ' + 'Minified javascript file has been created.'.green)));

//\\//\\//\\//\\//\\//\\//\\//\\//\\//\\//\\//\\//\\//\\//\\//\\

gulp.task('build-lib-css', () =>
    gulp.src(paths.lib.css, {
        base: paths.lib.base
    })
    .pipe(gprint(file => ' -> [' + 'lib'.cyan + '] Stylesheet file: ' + file))
    .pipe(rename({
        extname: '.css'
    }))
    .pipe(wrapper({
        header: "\n/*\n\tAHS502 : Start of '${filename}'\n*/\n\n",
        footer: "\n\n/*\n\tAHS502 : End of '${filename}'\n*/\n"
    }))
    .pipe(file('introduction.css', "// AHS502 : Application libraries stylesheet file :"))
    .pipe(concat(paths.lib.stylesheet))
    .pipe(gulp.dest(paths.dist))
    .on('end', () => util.log(' => [' + 'lib'.bold.cyan + '] ' + 'Stylesheet file has been created.'.green))
    // .pipe(sourcemaps.init())
    .pipe(cssnano())
    // .pipe(sourcemaps.write()) or .pipe(sourcemaps.write(paths.dist))
    .pipe(rename(paths.lib.stylesheetMinified))
    .pipe(gulp.dest(paths.dist))
    .on('end', () => util.log(' => [' + 'lib'.bold.cyan + '] ' + 'Minified stylesheet file has been created.'.green)));

//\\//\\//\\//\\//\\//\\//\\//\\//\\//\\//\\//\\//\\//\\//\\//\\

gulp.task('build-app', ['build-app-js', 'build-app-css']);

//\\//\\//\\//\\//\\//\\//\\//\\//\\//\\//\\//\\//\\//\\//\\//\\

gulp.task('build-lib', ['build-lib-js', 'build-lib-css']);

//\\//\\//\\//\\//\\//\\//\\//\\//\\//\\//\\//\\//\\//\\//\\//\\

gulp.task('build', ['clean'], () =>
    runSequence('build-lib', 'build-app')
);

//\\//\\//\\//\\//\\//\\//\\//\\//\\//\\//\\//\\//\\//\\//\\//\\

var pId;

gulp.task('start-node', callback => {

    if (pId) {
        util.log((' => Node.js is running on pid = ' + pId).red);
        util.log('    First of all, stop that process.'.red);
        return callback();
    }

    var child = childProcess.spawn('/usr/local/bin/node', ['./bin/start'], {
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

gulp.task('stop-node', callback => {
    if (pId) {
        var res = syncExec('kill ' + pId);
        pId = undefined;
    }
    callback();
});

//\\//\\//\\//\\//\\//\\//\\//\\//\\//\\//\\//\\//\\//\\//\\//\\

gulp.task('restart-node', callback => {
    if (pId)
        runSequence('stop-node', 'start-node');
    else
        runSequence('start-node');
    callback();
});

//\\//\\//\\//\\//\\//\\//\\//\\//\\//\\//\\//\\//\\//\\//\\//\\

// gulp.task('restart-browser', () => {
//     //TODO: Or use browsersync instead...
// })

//\\//\\//\\//\\//\\//\\//\\//\\//\\//\\//\\//\\//\\//\\//\\//\\

gulp.task('watch', callback => {
    gulp.watch(path.join(paths.app.src, '**/*.js'), ['build-app-js' /*, 'restart-browser'*/ ]);
    gulp.watch(path.join(paths.app.src, '**/*.coffee'), ['build-app-js' /*, 'restart-browser'*/ ]);
    gulp.watch(path.join(paths.app.style, '**/*.css'), ['build-app-css' /*, 'restart-browser'*/ ]);
    gulp.watch(path.join(paths.app.style, '**/*.less'), ['build-app-css' /*, 'restart-browser'*/ ]);
    callback();
});

//\\//\\//\\//\\//\\//\\//\\//\\//\\//\\//\\//\\//\\//\\//\\//\\




























//\\//\\//\\//\\//\\//\\//\\//\\//\\//\\//\\//\\//\\//\\//\\//\\

gulp.task('default', ['build', 'watch', 'start-node'], callback => {
    util.log(" => Type 'gulp help' for more information.".bold);
    callback(); // Nothing !
});

//\\//\\//\\//\\//\\//\\//\\//\\//\\//\\//\\//\\//\\//\\//\\//\\

gulp.task('help', callback => {

    //TODO: Upgrade help:
    
    // var help = [
    //     "=================================================".rainbow,
    //     "",
    //     " >> Usage: " + "gulp".bold + " to build, watch & start, or",
    //     "           " + "gulp COMMAND".bold,
    //     "",
    //     " COMMAND".bold + " can be:",
    //     "",
    //     "     clean       ".bold + "Cleans up public/dist folder",
    //     "     build       ".bold + "Builds all files",
    //     "     build-js    ".bold + "Builds javascript files",
    //     "     build-css   ".bold + "Builds stylesheet files",
    //     "     start       ".bold + "Starts Node.js express server",
    //     "     stop        ".bold + "Stops Node.js express server",
    //     "     watch       ".bold + "Watchs changes to source files to build",
    //     "",
    //     "=================================================".rainbow,
    // ];

    // help.forEach(line => process.stdout.write(line + '\n'));
    callback();
});

//\\//\\//\\//\\//\\//\\//\\//\\//\\//\\//\\//\\//\\//\\//\\//\\
