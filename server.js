require("coffee-script").register();

var express = require('express');
var path = require('path');
var favicon = require('serve-favicon');
var logger = require('morgan');
var cookieParser = require('cookie-parser');
var bodyParser = require('body-parser');
var fs = require("fs");
var colors = require("colors");

var app = express();

// view engine setup
app.set('views', path.join(__dirname, 'app/views'));
app.set('view engine', 'jade');

// uncomment after placing your favicon in /nodePort
//app.use(favicon(path.join(__dirname, 'nodePort', 'favicon.ico')));
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
