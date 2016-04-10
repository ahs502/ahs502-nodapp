require("coffee-script").register();

var express = require('express');
var path = require('path');
var favicon = require('serve-favicon');
var logger = require('morgan');
var cookieParser = require('cookie-parser');
var bodyParser = require('body-parser');
var fs = require("fs-extra");

require("colors");

var config = require("./config");

var app = express();

// view engine setup
app.set('views', path.join(__dirname, 'app/views'));
app.set('view engine', 'jade');

app.use(favicon(path.join(__dirname, 'app/assets/icon', 'shortcut-icon.png')));
app.use(logger('dev'));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({
    extended: false
}));
app.use(cookieParser());

// declare static folders
app.use('/public', express.static(path.join(__dirname, 'public')));
app.use('/dist', express.static(path.join(__dirname, 'app/dist')));
app.use('/assets', express.static(path.join(__dirname, 'app/assets')));

// setup meta server
app.use(path.join('/', config.meta.urlPrefix, config.meta.offlineCache.cacheManifestFile),
    metaCacheManifestHandler(config.meta.offlineCache));
app.use(path.join('/', config.meta.urlPrefix, config.meta.manifest.manifestFile),
    metaAndroidManifestHandler(config.meta.manifest.options));

// load route controllers
+ function extractRoutes(folder) {
    // folder :> 'routes' or 'routes/etc'
    var items = fs.readdirSync(folder);
    items.forEach(item => {
        // item :> 'index.js' or 'user'
        item = path.join(folder, item);
        // item :> 'routes/index.js' or 'routes/etc/user'
        var stat = fs.statSync(item);
        if (stat.isFile()) {
            // item :> 'routes/index.js'
            var routePath = undefined;
            item.slice(-3) == '.js' && (routePath = item.slice(0, -3));
            item.slice(-7) == '.coffee' && (routePath = item.slice(0, -7));
            if (routePath) {
                // routePath :> 'routes/index'
                var itemPath = './' + item;
                // itemPath :> './routes/index.js'
                try {
                    var route = require(itemPath),
                        routeBase = route.routeBase || routePath.slice(6);
                    // routeBase :> '/index'
                    !route.routeBase && (routeBase == '/index') && (routeBase = '/');
                    // routeBase :> '/'
                    route && routeBase && app.use(routeBase, route);
                    console.log('>> Load route controller ' + itemPath.blue.bold + ' for ' + routeBase.green.bold);
                }
                catch (err) {
                    console.log(('>> Could not load any route controller from ' + itemPath.bold).red);
                    console.log(String(err).red);
                }
            }
        }
        else if (stat.isDirectory()) {
            // item :> 'routes/etc/user'
            extractRoutes(item);
        }
    });
}('./routes');
console.log();

// catch 404 and forward to error handler
app.use(function(req, res, next) {
    var err = new Error('Not Found');
    err.status = 404;
    next(err);
});

// error handlers

// development error handler
// will print stacktrace
if (app.get('env') === 'development') {
    app.use(function(err, req, res, next) {
        res.status(err.status || 500);
        res.render('error', {
            message: err.message,
            error: err
        });
    });
}

// production error handler
// no stacktraces leaked to user
app.use(function(err, req, res, next) {
    res.status(err.status || 500);
    res.render('error', {
        message: err.message,
        error: {}
    });
});


module.exports = app;


//\\//\\//\\//\\//\\//\\//\\//\\//\\//\\//\\//\\//\\//\\//\\//\\

function metaCacheManifestHandler(options /* Most likely is config.meta.offlineCache */ ) {

    return (req, res, next) =>
        generateCacheManifest((err, cacheManifest) => {
            if (err) {
                console.log("ERROR: ", "Could not make cache manifest file.");
                next();
            }
            else {
                res.statusCode = 200;
                res.setHeader('content-type', 'text/cache-manifest');
                res.setHeader('content-length', Buffer.byteLength(cacheManifest));
                res.end(cacheManifest);
            }
        });

    function generateCacheManifest(callback /*(err, cacheManifest)*/ ) {
        generateListOfCacheItems((err, cacheItems, lastModifiedTime) => {
            if (err) {
                callback(err);
            }
            else {
                var a = [];
                a.push('CACHE MANIFEST');
                a.push('# ' + lastModifiedTime);
                a.push('');
                a.push('CACHE:');
                cacheItems.forEach(item => a.push(item));
                a.push('');
                a.push('FALLBACK:');
                options.fallbacks.forEach(item => a.push(item));
                a.push('');
                a.push('NETWORK:');
                options.networks.forEach(item => a.push(item));
                a.push('');
                callback(null, a.join('\n'));
            }
        });
    }

    function generateListOfCacheItems(callback /*(err, cacheItems, lastModifiedTime)*/ ) {
        var folders = options.folders,
            files = options.files,
            deps = options.deps,
            cacheItems = [],
            lastModifiedTime = 0,
            modifiedTime,
            cwd = process.cwd();

        files.forEach(file => {
            var place = file[0],
                url = file[1];
            url = path.join('/', url);
            cacheItems.indexOf(url) < 0 && cacheItems.push(url);
            try {
                modifiedTime = fs.statSync(place).mtime;
                lastModifiedTime = lastModifiedTime > modifiedTime ? lastModifiedTime : modifiedTime;
            }
            catch (err) {}
        });

        deps.forEach(dep => walkSync(dep, null, (file, stat) => {
            lastModifiedTime = lastModifiedTime > stat.mtime ? lastModifiedTime : stat.mtime;
        }, null));

        //TODO: Bad implementation, use my walkSync instead !
        function walkFolder(index, callback /*(err)*/ ) {
            if (index >= folders.length) {
                callback && callback(null);
                callback = null;
            }
            else {
                var folder = folders[index][0],
                    prefix = folders[index][1],
                    ignore = folders[index][2],
                    replace = folders[index][3];
                fs.walk(folder)
                    .on('data', item => {
                        if (callback &&
                            item.stats.isFile() &&
                            (!ignore || !ignore(item.path))) {
                            var itemPath = item.path.indexOf(cwd) === 0 ? item.path.slice(cwd.length) : item.path;
                            folder = path.join('/', folder);
                            itemPath = path.join('/', prefix, itemPath.indexOf(folder) === 0 ? itemPath.slice(folder.length) : itemPath);
                            replace && (itemPath = replace(itemPath));
                            cacheItems.indexOf(itemPath) < 0 && cacheItems.push(itemPath);
                            lastModifiedTime = lastModifiedTime > item.stats.mtime ? lastModifiedTime : item.stats.mtime;
                        }
                    })
                    .on('error', err => {
                        callback && callback(err || "Unknown error.");
                        callback = null;
                    })
                    .on('end', () => {
                        callback && walkFolder(index + 1, callback);
                    });
            }
        }

        walkFolder(0, err => {
            if (err) {
                callback(err);
            }
            else {
                callback(null, cacheItems, lastModifiedTime);
            }
        });
    }

}

function walkSync(path, callbackFolder /*(folder, stat)*/ , callbackFile /*(file, stat)*/ , decide /*(folder, stat):expand?*/ ) /*Returns array of {err, path}*/ {
    var errors = [];
    try {
        var stat = fs.statSync(path);
        if (stat.isFile()) {
            callbackFile && callbackFile(path, stat);
        }
        else if (stat.isDirectory()) {
            callbackFolder && callbackFolder(path, stat);
            if (!decide || (typeof decide != "function") || decide(path, stat)) {
                var subs = fs.readdirSync(path);
                subs && (subs.length > 0) && subs.forEach(sub => errors = errors.concat(walkSync(path + '/' + sub, callbackFolder, callbackFile, decide)));
            }
        }
        // See: https://nodejs.org/api/fs.html#fs_class_fs_stats
    }
    catch (err) {
        errors.push({
            err: err,
            path: path
        });
    }
    return errors;
}

// function walkAsync(path, callbackFolder /*(folder, stat)*/ , callbackFile /*(file, stat)*/ , callbackEnd /*(Array of {err, path})*/ , decide /*(folder, stat, expand*/ ) {
//     var errors = [],
//     callbackEndWrapped = errs => {
//         try {
//             (typeof callbackEnd === "function") && callbackEnd(errs);
//         }
//         catch (err) {}
//     };
//     fs.stat(path, (err, stat) => {
//         try {
//             if (err) throw err;
//             //: stat
//             if (stat.isFile()) {
//                 callbackFile && callbackFile(path, stat);
//                 callbackEndWrapped(errors);// errors should be []
//             }
//             else if (stat.isDirectory()) {
//                 callbackFolder && callbackFolder(path, stat);
//                 var expand = () => {
//                     fs.readdir(path, (err, subs) => {
//                         try {
//                             if (err) throw err;
//                             if (subs && subs.length > 0) {
//                                 //: subs
//                                 (function subWalk(index) {
//                                     if (index >= subs.length) {
//                                         return callbackEndWrapped(errors);
//                                     }
//                                     var subPath = path + '/' + subs[index];
//                                     walkAsync(subPath, callbackFolder, callbackFile, subErrors => {
//                                         errors = errors.concat(subErrors);
//                                         subWalk(index + 1);
//                                     }, decide);
//                                 })(0);
//                             }
//                         }
//                         catch (error) {
//                             errors.push({
//                                 err: error,
//                                 path: path
//                             });
//                             callbackEndWrapped(errors);
//                         }
//                     });
//                 };
//                 if (typeof decide === "function") {
//                     decide(path, stat, expand);
//                 }
//                 else {
//                     expand();
//                 }
//             }
//             // See: https://nodejs.org/api/fs.html#fs_class_fs_stats
//         }
//         catch (error) {
//             errors.push({
//                 err: error,
//                 path: path
//             });
//             (typeof callbackEndWrapped === "function") && callbackEndWrapped(errors);
//         }
//     });
// }

// walkAsync('.', (d, s) => console.log('>>', d), (f, s) => console.log('--', f), errs => console.log("ERRORS =", errs) , (d, s, expand) => ((d.indexOf('node_modules') < 0) &&(d.indexOf('/.') < 0) && expand()) );

function metaAndroidManifestHandler(options /* Most likely is config.meta.manifest.options */ ) {

    return (req, res, next) => {
        var manifest = JSON.stringify(options, null, 4) + '\n';
        res.statusCode = 200;
        res.setHeader('content-length', Buffer.byteLength(manifest));
        res.end(manifest);
    };

}
