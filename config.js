var config = {

    /* Local port to run Node.js server on for development, 12345 by default */
    nodePort: 8081, // 5 ports will be reserved (from nodePort to nodePort+4).

    /* Server IP address */
    serverIp: "176.9.194.237",

    /* Deployment environment */
    env: "dev", // "dev", "prod";

    buildPaths: {

        lib: {

            /* List of all javascript files of client-side modules */
            js: [
                "./app/lib/angular/angular.min.js",
                "./app/lib/angular-ui-router/release/angular-ui-router.min.js",
                "./app/lib/ui-router-extras/release/ct-ui-router-extras.min.js",
                
                "./app/lib/jquery/dist/jquery.min.js",
                
                "./app/lib/semantic/dist/semantic.min.js",
                
                "./app/lib/localforage/dist/localforage.min.js",
                "./app/lib/angular-localforage/dist/localforage.min.js",
            ],

            /* List of all stylesheet files of client-side modules */
            css: [
                "./app/lib/semantic/dist/semantic.min.css",
            ],

            base: "./app/lib/",

            javascript: "lib.js",
            stylesheet: "lib.css",
            javascriptMinified: "lib.min.js",
            stylesheetMinified: "lib.min.css"
        },

        app: {

            /*
            The path containing *.js and *.coffee source code files.
            You can use arbitrary directory structure to manage source files.
            Files within inner directories will be composed LATER.
            The exception is 'lib' folders, which you can put your modules in it.
            Files within 'lib' closure directories will be composed SOONER and at the TOP of other files.
            */
            src: "./app/src/",

            /*
            The path containing *.css and *.less stylesheet files.
            You can use arbitrary directory structure to manage stylesheet files.
            Files within inner directories will be composed SOONER.
            Files within 'lib' closure directories will be composed SOONER and at the TOP of other files.
            */
            style: "./app/style/",

            javascript: "app.js",
            stylesheet: "app.css",
            javascriptMinified: "app.min.js",
            stylesheetMinified: "app.min.css"
        },

        /* Path to store all resulted client-side materials */
        dist: "./app/dist/",

        /*
        Server-side routers including *.js and *.coffee files.
        Each file serve a base url path corresponding to its file path,
            e.g. file './routes/index.js' serves requests on '/*'
            and file './routes/user/auth/verify.coffee' serves requests on '/user/auth/verify/*'
            unless you explicitly specify base url in the router file by "router.routeBase = '/zxc';"
        */
        routes: [
            "./routes/**/*.js",
            "./routes/**/*.coffee"
        ],

        /*
        Server-side codes & modules including *.js and &.coffee files.
        You can use arbitrary directory structure to manage source files.
        Coffee files will be compiled to corresponding javascript files within the same path.
        */
        src: "./src/",

        /* Layouts and views including *.html/htm and *.jade files */
        views: [
            "./app/views/**/*.html",
            "./app/views/**/*.htm",
            "./app/views/**/*.jade"
        ],

        /* Public contents */
        assets: [
            "./public/**/*.*",
            "./app/assets/**/*.*"
        ]

    },

    /*
    Configuration for serving meta info aboute web app.
    */
    meta: {

        /* Rul prefix to serve meta info under it, by default is 'meta' */
        urlPrefix: 'meta',

        /* Settings needed to serve HTML5 offline cache manifest file */
        offlineCache: {

            cacheManifestFile: 'cache-manifest.appcache', // By default is 'cache-manifest.appcache'

            /*
            CACHE part for folders, all files within them are included.
            Each item has this format :
                [
                    'path/to/folder1',
                    ...
                    ['path/to/folder2', 'url/prefix2'],
                    ...
                    ['path/to/folder2', 'url/prefix2', ignore, replace],
                    ...
                ]
            where:
                'url/prefix2' by default is 'path/to/folder2' itself,
                ignore: file => someBooleanFrom(file)   //OPTIONAL: Filter files by their absolute path
                replace: url => someStringFrom(url)     //OPTIONAL: Modify urls of selected files
            By default is [].
            */
            folders: [
                ['app/assets/icon', 'assets/icon'],
                ['app/assets/img', 'assets/img'],
            ],

            /*
            CACHE part for files and links.
            Each item has this format :
                [
                    'some/path/to/a/file/or/custom/url',
                    ...
                    ['some/path/to/other/file', 'url/instead/of/path/to/that/file'],
                    ...
                ]
            By default is [].
            */
            files: [
                'dist/lib.min.css',
                'dist/lib.min.js',
                'dist/app.min.css',
                'dist/app.min.js',
                'meta/cache-manifest.appcache',
                'meta/android-manifest.json',
                '/',
            ],

            /*
            List of files/folders which last editing time depends on them.
            Some are not necessary if you cover them in folders or files part.
            By default is [].
            */
            deps: [
                'app/assets',
                'app/dist',
                'app/views',
                'bin',
                'public',
                'routes',
                'src',
                'config.js',
                'gulpfile.js',
                'server.js',
                'package.json',
            ],

            /* NETWORK entries, by default is ['*'] */
            // networks: [],

            /* FALLBACK entries, by default is [] */
            // fallbacks: []

        },

        manifest: {

            manifestFile: 'android-manifest.json', // By default is 'android-manifest.json'

            /* Installable webapp on android options */
            options: {

                name: "AHS502-Nodapp Installable WebApp",
                short_name: "AHS502-Nodapp",
                icons: [{
                    src: "assets/icon/android-icon.png",
                    sizes: "128x128",
                    type: "image/png"
                }],
                start_url: "index.html",
                display: "fullscreen",
                orientation: "any",
                background_color: "white",

            }

        },

        viewport: {
            width: "device-width",
            initialScale: 1,
            maximumScale: 1,
            userScalable: "no"
        },

    },

    /* dns :
    Bind9 name server configurations.
    First domain will be used for reverse zone.
    By default we have :
        At least ["ns1"] for ns,
        "mail" for mail,
        "host" for root and
        at least ["www"] for subdomains.
        Also, we have "CNAME" for "www" subdomain by default.
    In data settings :
        "A" will become "A xx.xx.xx.xx" and
        "CNAME" will become "CNAME domain.ir" unless
        you specify IP or Domain name explicitly or
        you use something else instead.
    Default value for each subdomain in data is "A".
    */
    dns: {

        "ahs502.ir": {
            // ns: ["ns1"],
            // mail: "mail",
            // root: "host",
            subdomains: ["www", "ide", "dev", "bs", "weinre", "test"],
            // data: {
            //     "ns1": "A",
            //     "mail": "A",
            //     "www": "CNAME",
            //     "ide": "A",
            //     "test": "A",
            //     // ...
            // }
        },

        "hesamhesab.ir": {
            subdomains: ["www", "ide", "dev", "bs", "weinre", "test"]
        },

        "mehrnoosh72.ir": {
            subdomains: ["www", "ide", "dev", "bs", "weinre", "test"]
        },

        "minush.ir": {
            subdomains: ["www", "ide", "dev", "bs", "weinre", "test"]
        },

    },

    /*
    Nginx server configurations.
    You can proxy each domain (with any subdomains if you want) to a specified url.
    The acceptable format is :
        {
            "[subdomain].domain.ir[/some/path]": "somewhereelse1",
            ...
            "[subdomain1].domain1.ir [subdomain2].domain2.ir [subdomain3].domain3.ir[/some/path]": "somewhereelse2",
            ...
        }
    where "somewhereelse" is something like 
        "http://localhost:8081" or
        "http://localhost:8082/some/path/" (It is better when ends by '/') or
        // "[browser-sync]:8085" (which aquire both ports 8085 and 8085+1=8086 on localhost).
    NOTE:
        If you map 'domain.ir/zxc' to 'somewhereelse', then
        a request to 'domain.ir/zxc' will be redirected to 'somewhereelse/zxc' ('/zxc' will not be discarded) and
        a request to 'domain.ir/zxc/asd' will be redirected to 'somewhereelse/zxc/asd'.
        For 'domain.ir/some/path' it is the same to redirect it to 'somewhereelse' or 'somewhereelse/some/path'.
    NOTE:
        If you set just 'domain.ir' without any prefix or postfix, but do not set 'www.domain.ir' to anywhere,
        then 'www.domain.ir' will be set automatically to 'domain.ir' by default.
    */
    nginx: {

        "ahs502.ir": "http://localhost:8011",
        "test.ahs502.ir": "http://localhost:8019",
        "ide.ahs502.ir": "http://localhost:8080",

        "hesamhesab.ir": "http://localhost:8021",
        "test.hesamhesab.ir": "http://localhost:8029",
        "ide.hesamhesab.ir": "http://localhost:8080",

        "mehrnoosh72.ir": "http://localhost:8031",
        "test.mehrnoosh72.ir": "http://localhost:8039",
        "ide.mehrnoosh72.ir": "http://localhost:8080",

        "minush.ir": "http://localhost:8041",
        "test.minush.ir": "http://localhost:8049",
        "ide.minush.ir": "http://localhost:8080",

    },

    /*
    All browser-sync options, see: https://www.browsersync.io/docs/options/
    Field 'domains' are custom and is being used to config test and ui
        to optionally assined domains by nginx.
    */
    browserSync: {

        /* All fields are optional */
        domains: {
            dev: "dev.ahs502.ir", //: localPort & localPort+1
            ui: "bs.ahs502.ir", //: localPort+2
            weinre: "weinre.ahs502.ir", //: localPort+3
        },

        port: null, // By default = config.nodePort + 1

        /* Other options */

        online: true,
        //TODO: open: ???,
        reloadDebounce: 3000,
        reloadDelay: 0,
        injectChanges: false,
        minify: false,
        ghostMode: {
            clicks: true,
            scroll: true,
            forms: true
        },
        notify: true,
        injectChanges: true, // For CSSes
        // ...

    },

    /*
    Database connection string settings.
    If 'db' is not set or 'connectionString' does not have db name,
        then you can use config.database.connectionDb(dbName) to get the connection string.
    */
    database: {

        format: "mongodb",
        username: null,
        password: null,
        hosts: [
            "localhost:27017"
        ],
        db: null,

        /*
        If you set this, other parameters will be discarded.
        Otherwise, it will be evaluated automatically by other parameters :
            "[format://][username:password@]host1[:port1][,host2[:port2],...[,hostN[:portN]]][/database]"
        */
        connectionString: ""
    }

};

//\\//\\//\\//\\//\\//\\//\\//\\//\\//\\//\\//\\//\\//\\//\\//\\

//\\//\\//\\//\\//\\//\\//\\//\\//\\//\\//\\//\\//\\//\\//\\//\\

//\\//\\//\\//\\//\\//\\//\\//\\//\\//\\//\\//\\//\\//\\//\\//\\

/*
Set all default values
*/

var temp, i;

config.nodePort = config.nodePort || 12345;

config.dns = config.dns || {};

config.nginx = config.nginx || {};

config.meta.urlPrefix = config.meta.urlPrefix || 'meta';
config.meta.offlineCache.cacheManifestFile = config.meta.offlineCache.cacheManifestFile || 'cache-manifest.appcache';
config.meta.offlineCache.folders = config.meta.offlineCache.folders || [];
config.meta.offlineCache.files = config.meta.offlineCache.files || [];
config.meta.offlineCache.deps = config.meta.offlineCache.deps || [];
config.meta.offlineCache.networks = config.meta.offlineCache.networks || ['*'];
config.meta.offlineCache.fallbacks = config.meta.offlineCache.fallbacks || [];

temp = [];
config.meta.offlineCache.folders.forEach(folder => {
    if (typeof folder === "string") {
        temp.push([folder, folder, null, null]);
    }
    else if (typeof folder === "object") {
        temp.push([folder[0], folder[1] || folder[0], folder[2] || null, folder[3] || null]);
    }
});
config.meta.offlineCache.folders = temp;

temp = [];
config.meta.offlineCache.files.forEach(file => {
    if (typeof file === "string") {
        temp.push([file, file]);
    }
    else if (typeof file === "object") {
        temp.push([file[0], file[1] || file[0]]);
    }
});
config.meta.offlineCache.files = temp;

config.browserSync = config.browserSync || {};
config.browserSync.domains = config.browserSync.domains || {};
config.browserSync.port = config.browserSync.port || (config.nodePort + 1);

config.browserSync.proxy = config.browserSync.proxy || {};
config.browserSync.proxy.target = "localhost:" + config.nodePort;
config.browserSync.proxy.ws = true;

(config.browserSync.ui === undefined) && (config.browserSync.ui = {
    port: config.browserSync.port + 2,
    weinre: {
        port: config.browserSync.port + 3
    }
});

config.browserSync.socket = config.browserSync.socket || {};
config.browserSync.socket.path = "/browser-sync/socket.io";
config.browserSync.socket.clientPath = "/browser-sync";
config.browserSync.socket.namespace = "/browser-sync";
config.browserSync.socket.domain = config.browserSync.domains.dev;

if (config.browserSync.domains.dev) {
    config.nginx[config.browserSync.domains.dev] = "http://localhost:" + config.browserSync.port;
    config.nginx[config.browserSync.domains.dev + "/browser-sync/socket.io"] =
        "http://localhost:" + (config.browserSync.port + 1) + "/browser-sync/socket.io/";
}

if (config.browserSync.domains.ui) {
    config.nginx[config.browserSync.domains.ui] = "http://localhost:" + (config.browserSync.port + 2);
}

if (config.browserSync.domains.weinre) {
    config.nginx[config.browserSync.domains.weinre] = "http://localhost:" + (config.browserSync.port + 3);
}

var allDomains = Object.keys(config.nginx)
    .map(dd => dd.split(' ').filter(d => d != ''))
    .reduce((previousValue, currentValue, currentIndex, array) => previousValue.concat(currentValue), []),
    domain, domainKey;

for (domain in config.dns) {
    if ((allDomains.indexOf(domain) >= 0) && !(allDomains.indexOf("www." + domain) >= 0)) {
        for (domainKey in config.nginx) {
            if (domainKey.split(' ').indexOf(domain) >= 0) {
                config.nginx[domainKey + " www." + domain] = config.nginx[domainKey];
                delete config.nginx[domainKey];
                break;
            }
        }
    }
}

config.database.hosts = config.database.hosts || [];
(!config.database.connectionString || (typeof config.database.connectionString !== "string") || (config.database.connectionString === "")) && (config.database.connectionString = (config.database.format ? (config.database.format + "://") : "") + (config.database.username ? (config.database.password ? (config.database.username + ":" + config.database.password + "@") : config.database.username + "@") : "") + config.database.hosts.join(",") + "/" + (config.database.db ? config.database.db : ""));

config.database.connectionDb = dbName => config.database.connectionString + dbName;

//\\//\\//\\//\\//\\//\\//\\//\\//\\//\\//\\//\\//\\//\\//\\//\\

//\\//\\//\\//\\//\\//\\//\\//\\//\\//\\//\\//\\//\\//\\//\\//\\

//\\//\\//\\//\\//\\//\\//\\//\\//\\//\\//\\//\\//\\//\\//\\//\\

module.exports = config;

//\\//\\//\\//\\//\\//\\//\\//\\//\\//\\//\\//\\//\\//\\//\\//\\
