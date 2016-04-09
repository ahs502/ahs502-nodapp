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

    // For test purposes :
    //metaCacheManifestHandler(config.meta.offlineCache);

function metaCacheManifestHandler(options) {

    // For test purposes :
    //return generateListOfCacheItems((err, items) => console.log(String(err).red + '\n', JSON.stringify(items, null, 4)));

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
            cacheItems = [],
            lastModifiedTime = 0,
            modifiedTime,
            cwd = process.cwd();

        files.forEach(file => {
            var place = file[0],
                url = file[1];
            url = path.join('/', url);
            cacheItems.indexOf(url) < 0 && cacheItems.push(url);
            modifiedTime = fs.statSync(place).mtime;
            lastModifiedTime = lastModifiedTime > modifiedTime ? lastModifiedTime : modifiedTime;
        });

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
                            item.stats.nlink == 1 &&
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

