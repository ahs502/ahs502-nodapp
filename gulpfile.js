var gulp = require("gulp");
var util = require("gulp-util");
var coffee = require('gulp-coffee');
var concat = require('gulp-concat');
var uglify = require('gulp-uglify');
var less = require('gulp-less');
var cssnano = require('gulp-cssnano');
//var imagemin = require('gulp-imagemin');
//var sourcemaps = require('gulp-sourcemaps');
var gprint = require('gulp-print');
var rename = require("gulp-rename");
var merge = require("merge-stream");
var wrapper = require("gulp-wrapper");
var filter = require("gulp-filter");
var file = require("gulp-file");
var shell = require("gulp-shell");

var runSequence = require('run-sequence');

var path = require('path');
var del = require('del');
var syncExec = require('sync-exec');
var childProcess = require('child_process');

/*var colors =*/
require('colors');

var bs, browserSync = require("browser-sync");

//\\//\\//\\//\\//\\//\\//\\//\\//\\//\\//\\//\\//\\//\\//\\//\\

var config = require("./config");

//\\//\\//\\//\\//\\//\\//\\//\\//\\//\\//\\//\\//\\//\\//\\//\\

gulp.task('clean', callback => {
    del([path.join(config.paths.dist, '*')]).then(items => {
        if (items && items.length && items.length > 0) {
            util.log(' -> ' + 'Deleted files and folders :'.green);
            items.forEach(item => util.log(item.yellow));
        }
        util.log(' => ' + 'Already clean !'.green);
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
    return gulp.src([].concat(config.paths.app.src).map(x => path.join(config.paths.app.srcBase, x)), {
            base: config.paths.app.srcBase
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
        .pipe(concat('app.js'))
        .pipe(gulp.dest(config.paths.dist))
        .on('end', () => util.log(' => [' + 'app'.bold.cyan + '] ' + 'Javascript file has been created.'.green))
        // .pipe(sourcemaps.init())
        .pipe(uglify())
        // .pipe(sourcemaps.write()) or .pipe(sourcemaps.write(config.paths.dist))
        .pipe(rename('app.min.js'))
        .pipe(gulp.dest(config.paths.dist))
        .on('end', () => util.log(' => [' + 'app'.bold.cyan + '] ' + 'Minified javascript file has been created.'.green));
});

//\\//\\//\\//\\//\\//\\//\\//\\//\\//\\//\\//\\//\\//\\//\\//\\

gulp.task('build-app-css', () => {
    var cssFilter = filter('**/*.css', {
        restore: true
    });
    var lessFilter = filter('**/*.less', {
        restore: true
    });
    return gulp.src([].concat(config.paths.app.style).map(x => path.join(config.paths.app.styleBase, x)), {
            base: config.paths.app.styleBase
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
        .pipe(file('introduction.css', "/* AHS502 : Application stylesheet file : */"))
        .pipe(concat('app.css'))
        .pipe(gulp.dest(config.paths.dist))
        .on('end', () => util.log(' => [' + 'app'.bold.cyan + '] ' + 'Stylesheet file has been created.'.green))
        // .pipe(sourcemaps.init())
        .pipe(cssnano())
        // .pipe(sourcemaps.write()) or .pipe(sourcemaps.write(config.paths.dist))
        .pipe(rename('app.min.css'))
        .pipe(gulp.dest(config.paths.dist))
        .on('end', () => util.log(' => [' + 'app'.bold.cyan + '] ' + 'Minified stylesheet file has been created.'.green));
});

//\\//\\//\\//\\//\\//\\//\\//\\//\\//\\//\\//\\//\\//\\//\\//\\

gulp.task('build-lib-js', () =>
    gulp.src([].concat(config.paths.lib.js).map(x => path.join(config.paths.lib.jsBase, x)), {
        base: config.paths.lib.jsBase
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
    .pipe(concat('lib.js'))
    .pipe(gulp.dest(config.paths.dist))
    .on('end', () => util.log(' => [' + 'lib'.bold.cyan + '] ' + 'Javascript file has been created.'.green))
    // // .pipe(sourcemaps.init())
    // .pipe(uglify())
    // // .pipe(sourcemaps.write()) or .pipe(sourcemaps.write(config.paths.dist))
    .pipe(rename('lib.min.js'))
    .pipe(gulp.dest(config.paths.dist))
    .on('end', () => util.log(' => [' + 'lib'.bold.cyan + '] ' + 'Minified javascript file has been created.'.green)));

//\\//\\//\\//\\//\\//\\//\\//\\//\\//\\//\\//\\//\\//\\//\\//\\

gulp.task('build-lib-css', () =>
    gulp.src([].concat(config.paths.lib.css).map(x => path.join(config.paths.lib.cssBase, x)), {
        base: config.paths.lib.cssBase
    })
    .pipe(gprint(file => ' -> [' + 'lib'.cyan + '] Stylesheet file: ' + file))
    .pipe(rename({
        extname: '.css'
    }))
    .pipe(wrapper({
        header: "\n/*\n\tAHS502 : Start of '${filename}'\n*/\n\n",
        footer: "\n\n/*\n\tAHS502 : End of '${filename}'\n*/\n"
    }))
    .pipe(file('introduction.css', "/* AHS502 : Application libraries stylesheet file : */"))
    .pipe(concat('lib.css'))
    .pipe(gulp.dest(config.paths.dist))
    .on('end', () => util.log(' => [' + 'lib'.bold.cyan + '] ' + 'Stylesheet file has been created.'.green))
    // // .pipe(sourcemaps.init())
    // .pipe(cssnano())
    // // .pipe(sourcemaps.write()) or .pipe(sourcemaps.write(config.paths.dist))
    .pipe(rename('lib.min.css'))
    .pipe(gulp.dest(config.paths.dist))
    .on('end', () => util.log(' => [' + 'lib'.bold.cyan + '] ' + 'Minified stylesheet file has been created.'.green)));

//\\//\\//\\//\\//\\//\\//\\//\\//\\//\\//\\//\\//\\//\\//\\//\\

gulp.task('build-app', ['build-app-js', 'build-app-css']);

//\\//\\//\\//\\//\\//\\//\\//\\//\\//\\//\\//\\//\\//\\//\\//\\

gulp.task('build-lib', ['build-lib-js', 'build-lib-css']);

//\\//\\//\\//\\//\\//\\//\\//\\//\\//\\//\\//\\//\\//\\//\\//\\

gulp.task('build-src', () =>
    gulp.src(path.join(config.paths.src, '**/*.coffee'), {
        base: config.paths.src
    })
    .pipe(gprint(file => ' -> [' + 'src'.magenta + '] Coffeescript file: ' + file))
    .pipe(coffee({
            bare: false // Each file in a separate IIFE scope
        })
        .on('error', error => {
            util.log(error);
            util.log("\nSTACK: ".red.bold + error.stack);
        }))
    .pipe(gprint(file => ' -> [' + 'src'.bold.magenta + '] ' + file + ' has been created.'))
    .pipe(gulp.dest(config.paths.src))
    .on('end', () => util.log(' => [' + 'src'.bold.cyan + '] ' + 'All server-side source files have been compiled.'.green)));

//\\//\\//\\//\\//\\//\\//\\//\\//\\//\\//\\//\\//\\//\\//\\//\\

gulp.task('build', ['clean'], () =>
    runSequence('build-lib', 'build-app', 'build-src'));

//\\//\\//\\//\\//\\//\\//\\//\\//\\//\\//\\//\\//\\//\\//\\//\\

var pId;

gulp.task('start-node', callback => {

    if (pId) {
        util.log((' => Node.js is running on pid = ' + pId).red);
        util.log('    First of all, stop that process.'.red);
        return callback();
    }

    var child = childProcess.spawn('/usr/bin/node', ['./bin/start'], {
        env: {
            PORT: config.port
        }
    });

    pId = child.pid;

    child.stdout.on('data', data => process.stdout.write(data));
    child.stderr.on('data', data => process.stderr.write(data));

    util.log(' => ' + ('Node.js'.bold + ' started with pid = ' + String(pId).bold + ' :').green);

    callback();
});

//\\//\\//\\//\\//\\//\\//\\//\\//\\//\\//\\//\\//\\//\\//\\//\\

gulp.task('stop-node', callback => {
    if (pId) {
        syncExec('kill ' + pId);
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

gulp.task('watch', callback => {

    gulp.watch(path.join(config.paths.app.srcBase, '**/*.js'), ['build-app-js']);
    gulp.watch(path.join(config.paths.app.srcBase, '**/*.coffee'), ['build-app-js']);
    gulp.watch(path.join(config.paths.app.styleBase, '**/*.css'), ['build-app-css']);
    gulp.watch(path.join(config.paths.app.styleBase, '**/*.less'), ['build-app-css']);

    gulp.watch(path.join(config.paths.src, '**/*.coffee'), ['build-src']);
    gulp.watch(path.join(config.paths.src, '**/*.js'), ['restart-node']);
    gulp.watch(config.paths.routes, ['restart-node']);

    callback();
});

//\\//\\//\\//\\//\\//\\//\\//\\//\\//\\//\\//\\//\\//\\//\\//\\

gulp.task('browser-sync', callback => {
    if (!config.browserSync.enable)
        return callback();

    bs = browserSync.create("ahs502-nodapp-bs");
    bs.init(config.browserSync.options, () => {

        gulp.watch([
            path.join(config.paths.dist, 'app.min.js'),
            path.join(config.paths.dist, 'lib.min.js')
        ]).on("change", bs.reload);

        gulp.watch(path.join(config.paths.dist, 'app.min.css'))
            .on("change", () => bs.reload(path.join(config.paths.dist, 'app.min.css')));

        gulp.watch(path.join(config.paths.dist, 'lib.min.css'))
            .on("change", () => bs.reload(path.join(config.paths.dist, 'lib.min.css')));

        gulp.watch(config.paths.views).on("change", bs.reload);
        gulp.watch(config.paths.assets).on("change", bs.reload);

        gulp.watch(path.join(config.paths.src, '**/*.js')).on("change", bs.reload);
        gulp.watch(config.paths.routes).on("change", bs.reload);

        callback();
    });

});

//\\//\\//\\//\\//\\//\\//\\//\\//\\//\\//\\//\\//\\//\\//\\//\\

gulp.task('start', ['start-node', 'watch', 'browser-sync'], callback => {
    util.log(" => Type 'gulp help' for more information.".bold);
    callback(); // Nothing !
});

//\\//\\//\\//\\//\\//\\//\\//\\//\\//\\//\\//\\//\\//\\//\\//\\

gulp.task('start-app', ['build-app', 'build-src', 'start-node', 'watch', 'browser-sync'], callback => {
    util.log(" => Type 'gulp help' for more information.".bold);
    callback(); // Nothing !
});

//\\//\\//\\//\\//\\//\\//\\//\\//\\//\\//\\//\\//\\//\\//\\//\\

gulp.task('default-dev', ['build', 'start-node', 'watch', 'browser-sync'], callback => {
    util.log(" => Type 'gulp help' for more information.".bold);
    callback(); // Nothing !
});

//\\//\\//\\//\\//\\//\\//\\//\\//\\//\\//\\//\\//\\//\\//\\//\\

gulp.task('default-prod', callback => {

    //TODO: ...

    util.log(" => Type 'gulp help' for more information.".bold);
    callback(); // Nothing !
});

//\\//\\//\\//\\//\\//\\//\\//\\//\\//\\//\\//\\//\\//\\//\\//\\

gulp.task('default', callback => {
    if (config.env === "dev") {
        runSequence('default-dev');
    }
    else if (config.env === "prod") {
        runSequence('default-prod');
    }
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

//\\//\\//\\//\\//\\//\\//\\//\\//\\//\\//\\//\\//\\//\\//\\//\\

//\\//\\//\\//\\//\\//\\//\\//\\//\\//\\//\\//\\//\\//\\//\\//\\

// function appPath(basePath, extensions, reverse /*=false*/ , deepName /*='*'*/ ) {
//     deepName = deepName || '*';
//
//     function subPath(midPath) {
//         return extensions.map(extension => path.join(basePath, midPath, '*.' + extension));
//     }
//
//     function midPath(number) {
//         return '/' + Array(number + 1).join(deepName + '/');
//     }
//
//     var files = [
//         subPath(midPath(0)),
//         subPath(midPath(1)),
//         subPath(midPath(2)),
//         subPath(midPath(3)),
//         subPath(midPath(4)),
//         subPath(midPath(5)),
//         subPath(midPath(6)),
//         subPath(midPath(7)),
//         subPath(midPath(8)),
//         subPath(midPath(9)),
//         subPath(midPath(9) + '**/')
//     ].reduce((total, current, index, array) => total.concat(current), []);
//     reverse && files.reverse();
//     return files;
// }

//\\//\\//\\//\\//\\//\\//\\//\\//\\//\\//\\//\\//\\//\\//\\//\\







































// gulp.task('start-1', callback => {
//     runSequence('build-app');
//     util.log(" => Type 'gulp help' for more information.".bold);
//     callback(); // Nothing !
// });

// //\\//\\//\\//\\//\\//\\//\\//\\//\\//\\//\\//\\//\\//\\//\\//\\

// gulp.task('start-2', ['start-1'], callback => {
//     runSequence('build-src');
//     util.log(" => Type 'gulp help' for more information.".bold);
//     callback(); // Nothing !
// });

// //\\//\\//\\//\\//\\//\\//\\//\\//\\//\\//\\//\\//\\//\\//\\//\\

// gulp.task('start-3', ['start-2'], callback => {
//     runSequence('start-node');
//     util.log(" => Type 'gulp help' for more information.".bold);
//     callback(); // Nothing !
// });

// //\\//\\//\\//\\//\\//\\//\\//\\//\\//\\//\\//\\//\\//\\//\\//\\

// gulp.task('start-4', ['start-3'], callback => {
//     runSequence('watch');
//     util.log(" => Type 'gulp help' for more information.".bold);
//     callback(); // Nothing !
// });

// //\\//\\//\\//\\//\\//\\//\\//\\//\\//\\//\\//\\//\\//\\//\\//\\

// gulp.task('start-5', ['start-4'], callback => {
//     runSequence('browser-sync');
//     util.log(" => Type 'gulp help' for more information.".bold);
//     callback(); // Nothing !
// });
