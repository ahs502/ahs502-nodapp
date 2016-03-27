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
var shell = require("gulp-shell");

var runSequence = require('run-sequence');

var path = require('path');
var del = require('del');
var colors = require('colors');
var syncExec = require('sync-exec');
var childProcess = require('child_process');

//\\//\\//\\//\\//\\//\\//\\//\\//\\//\\//\\//\\//\\//\\//\\//\\

var config = require("./config");
var paths = config.buildPaths;

//\\//\\//\\//\\//\\//\\//\\//\\//\\//\\//\\//\\//\\//\\//\\//\\

gulp.task('clean', callback => {
    del([path.join(paths.dist, '*')]).then(items => {
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
        .pipe(file('introduction.css', "/* AHS502 : Application stylesheet file : */"))
        .pipe(concat(paths.app.stylesheet))
        .pipe(gulp.dest(paths.dist))
        .on('end', () => util.log(' => [' + 'app'.bold.cyan + '] ' + 'Stylesheet file has been created.'.green))
        // .pipe(sourcemaps.init())
        .pipe(cssnano())
        // .pipe(sourcemaps.write()) or .pipe(sourcemaps.write(paths.dist))
        .pipe(rename(paths.app.stylesheetMinified))
        .pipe(gulp.dest(paths.dist))
        .on('end', () => util.log(' => [' + 'app'.bold.cyan + '] ' + 'Minified stylesheet file has been created.'.green));
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
    .pipe(file('introduction.css', "/* AHS502 : Application libraries stylesheet file : */"))
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

    var child = childProcess.spawn('/usr/bin/node', ['./bin/start'], {
        env: {
            PORT: config.nodePort
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

    gulp.watch(paths.assets, [ /*'restart-browser'*/ ]);

    gulp.watch(paths.routes, ['restart-node']);

    callback();
});

//\\//\\//\\//\\//\\//\\//\\//\\//\\//\\//\\//\\//\\//\\//\\//\\

gulp.task('default', ['build', 'watch', 'start-node'], callback => {
    util.log(" => Type 'gulp help' for more information.".bold);
    callback(); // Nothing !
});

//\\//\\//\\//\\//\\//\\//\\//\\//\\//\\//\\//\\//\\//\\//\\//\\

gulp.task('bind9', callback => {
    var ip = config.serverIp || "11.22.33.44",
        dns = config.dns || {},
        named_conf_local = "",
        zone_db = {},
        mainDomain;

    for (var domain in dns) {
        mainDomain = mainDomain || domain;

        var domainConfig = dns[domain] = dns[domain] || {},
            ns = domainConfig.ns = domainConfig.ns || ["ns1"],
            mail = domainConfig.mail = domainConfig.mail || "mail",
            root = domainConfig.root = domainConfig.root || "host",
            subdomains = domainConfig.subdomains = domainConfig.subdomains || ["www"],
            data = domainConfig.data = domainConfig.data || {};
        (subdomains.indexOf("www") < 0) && subdomains.push("www");
        (subdomains.indexOf(mail) < 0) && subdomains.push(mail);
        ns.forEach(ns0 => (subdomains.indexOf(ns0) < 0) && subdomains.push(ns0));
        data["www"] = data["www"] || "CNAME";

        var resolver = subdomain => {
            var res = data[subdomain] || "A";
            (res == "A") && (res = "A " + ip);
            (res == "CNAME") && (res = "CNAME " + domain + ".");
            return res;
        };

        named_conf_local +=
            'zone "' + domain + '" {\n' +
            '        type master;\n' +
            '        file "/etc/bind/zones/' + domain + '.db";\n' +
            '};\n' +
            '\n';

        var db =
            "$TTL 14400\n" +
            "@ IN SOA " + ns[0] + "." + domain + ". " + root + "." + domain + ". (\n" +
            "               2016032700 ; Serial\n" +
            "               7200       ; Refresh\n" +
            "               120        ; Retry\n" +
            "               2419200    ; Expire\n" +
            "               604800)    ; Default TTL\n" +
            "\n";
        ns.forEach(ns0 => db += domain + ". IN NS " + ns0 + "." + domain + ".\n");
        db +=
            "\n" +
            domain + ". IN MX 10 " + mail + "." + domain + ".\n" +
            domain + ". IN A " + ip + "\n" +
            "\n";

        subdomains.forEach(subdomain => db += subdomain + " IN " + resolver(subdomain) + "\n");
        zone_db[domain + ".db"] = db;
    }

    var reverseZone = ip.split('.').reverse().slice(1).join('.') + ".in-addr.arpa";

    named_conf_local +=
        'zone "' + reverseZone + '" {\n' +
        '        type master;\n' +
        '        file "/etc/bind/zones/rev.' + reverseZone + '";\n' +
        '};\n' +
        '\n';

    zone_db["rev." + reverseZone] =
        "$TTL 14400\n" +
        "@ IN SOA " + mainDomain + ". " + dns[mainDomain].root + "." + mainDomain + ". (\n" +
        "              2016032700 ; Serial\n" +
        "              28800      ;\n" +
        "              604800     ;\n" +
        "              604800     ;\n" +
        "              86400)     ;\n" +
        "\n" +
        "@ IN NS " + dns[mainDomain].ns[0] + "." + mainDomain + ".\n";

    //TODO: What about '/etc/resolv.conf' ? It needs some R&D !

    var streams = [file('named.conf.local', named_conf_local, {
            src: true
        })
        .pipe(gulp.dest('/etc/bind/'))
        .pipe(gprint(file => ' -> [' + 'bind9'.blue + '] ' + file + ' has been saved.'.green))
    ];

    for (var zoneFile in zone_db) {
        streams.push(file(zoneFile, zone_db[zoneFile], {
                src: true
            })
            .pipe(gulp.dest('/etc/bind/zones/'))
            .pipe(gprint(file => ' -> [' + 'bind9'.blue + '] ' + file + ' has been saved.'.green)));
    };

    return merge.apply(this, streams)
        .pipe(concat('dumb.file'))
        .pipe(shell([
            "./bin/bind9-zone-serial-update.sh",
            "/etc/init.d/bind9 restart"
        ], {
            quiet: true
        }))
        .on('end', () => {
            util.log(' => [' + 'bind9'.bold.blue + '] ' + 'Route servers have been set.'.green);
            util.log(' -> [' + 'bind9'.bold.blue + '] ' + 'Use the following commands to check the results :');
            util.log('            tail -f /var/log/syslog'.bold.cyan + '   It should contain no errors !'.gray);
            util.log('            nslookup '.bold.cyan + 'domain.ir'.cyan + '        Check domain zone for every domain,'.gray);
            util.log('            host '.bold.cyan + 'xx.xx.xx.xx'.cyan + '          Check reverse zone.'.gray);
        });
});

//\\//\\//\\//\\//\\//\\//\\//\\//\\//\\//\\//\\//\\//\\//\\//\\

gulp.task('nginx', () => {
    util.log(" -> [" + 'nginx'.yellow + "] Configuring nginx on your server...");

    var data = "",
        routes = (config && config.nginx) || {};

    for (var domain in routes) {
        data +=
            "server {\n" +
            "    listen 80;\n" +
            "    server_name " + domain + ";\n" +
            "    location / {\n" +
            "        proxy_pass " + routes[domain] + ";\n" +
            "        proxy_http_version 1.1;\n" +
            "        proxy_set_header Upgrade $http_upgrade;\n" +
            "        proxy_set_header Connection 'upgrade';\n" +
            "        proxy_set_header Host $host;\n" +
            "        proxy_cache_bypass $http_upgrade;\n" +
            "    }\n" +
            "}\n" +
            "\n";
    }

    return file('default', data, {
            src: true
        })
        .pipe(gulp.dest('/etc/nginx/sites-available/'))
        .pipe(shell(["sudo nginx -s reload"], {
            quiet: true
        }))
        .on('end', () => util.log(' => [' + 'nginx'.bold.yellow + '] ' + 'Route servers have been set.'.green));
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

//\\//\\//\\//\\//\\//\\//\\//\\//\\//\\//\\//\\//\\//\\//\\//\\
