var config = {

    /* Local port to run Node.js server on for development, 12345 by default */
    port: 8081, // 5 ports will be reserved (from port to port + 4) when setting BrowserSync.

    /* Deployment environment */
    env: "dev", // "dev", "prod";

    /* HTTPS configuration */
    https: {

        enable: false, // true, false, "env", ["env1", "env2", ... ]; for some deployment environment(s).

        privateKey: "/root/ssl-keys/server.key", // RSA private key file path
        certificate: "/root/ssl-keys/server.crt" // Certificate file path

    },

    /*
    IMPORTANT NOTE:
        For now I've decided to just use minified versions of lib dependencies.
        So, minified combined lib files are the same as original combined lib files.
        Uncomment minimizing part of the responsible gulp task to enable it again.
    */
    paths: {

        /* Lists of all javascript / stylesheet files of client-side modules */
        lib: {

            js: [

                "angular/angular.min.js",
                "angular-ui-router/release/angular-ui-router.min.js",
                //"ui-router-extras/release/ct-ui-router-extras.min.js",

                "jquery/dist/jquery.min.js",

                "localforage/dist/localforage.min.js",
                // "angular-localforage/dist/angular-localForage.min.js",

                /* Semantic-ui modules */
                // "semantic/dist/semantic.min.js",
                "semantic/dist/components/site.min.js",

            ],

            css: [

                /* Semantic-ui modules */
                // "semantic/dist/semantic.min.css",
                "semantic/dist/components/site.min.css",
                "semantic/dist/components/button.min.css",

            ],

            jsBase: "./app/lib/",
            cssBase:"./app/lib/"
        },

        /* Lists of *.js and *.coffee source code files and *.css and *.less stylesheet files */
        app: {

            src: [

                "**/*.js",
                "**/*.coffee",

            ],

            style: [

                "**/*.css",
                "**/*.less",

            ],

            srcBase: "./app/src/",
            styleBase:"./app/style/"
        },

        /* Path to store all resulted client-side javascripts / stylesheets */
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
        Server-side codes & modules including *.js and *.coffee files.
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
    Configuration for serving meta info about web app.
    See: https://gist.github.com/kevinSuttle/1997924
    */
    webapp: {

        offline: false,
        webappCapable: false,

        offlineCache: {

            cacheManifestUrl: '/cache-manifest.appcache', // By default is '/cache-manifest.appcache'

            version: '1.0.0', // Optional, a custom cache version alongside calculated last modification time

            /*
            CACHE part for folders, all files within them are included.
            Each item can have one of these formats :
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
                    ['some/path/to/a/file', 'url/instead/of/path/to/that/file'],
                    ...
                ]
            By default is [].
            */
            files: [
                '/',
                'cache-manifest.appcache',
                'android-manifest.json',
                'dist/lib.min.css',
                'dist/lib.min.js',
                'dist/app.min.css',
                'dist/app.min.js',
            ],

            /*
            List of files/folders which last editing time depends on them.
            Some are not necessary if you cover them in folders or files part.
            By default is [].
            */
            dependencies: [
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
                'bower.json',
            ],

            /* NETWORK entries, by default is ['*'] */
            networks: null,

            /* FALLBACK entries, by default is [] */
            fallbacks: null,

        },

        androidManifest: {

            androidManifestUrl: '/android-manifest.json', // By default is '/android-manifest.json'

            /*
            Installable webapp on android options.
            See: https://w3c-webmob.github.io/installable-webapps/
            Also, see: https://www.w3.org/2008/webapps/manifest/
            */
            options: {
                name: "AHS502-Nodapp Installable WebApp",
                short_name: "AHS502-Nodapp",
                icons: [{
                    src: "assets/icon/android-icon.png",
                    sizes: "128x128",
                    type: "image/png"
                }],
                start_url: "/",
                display: "fullscreen",
                orientation: "any",
                background_color: "white",
            }

        }

    },

    /* BrowserSync configuration for this project */
    browserSync: {

        enable: true,

        /*
        NOTE:
            browserSync.developeOn must be the same as
            browserSync.dev for the global VPS configuration.
        */
        developOn: 'dev.ahs502.ir',

        // All browser-sync options, see: https://www.browsersync.io/docs/options/
        options: {
            online: true,
            //TODO: open: ???,
            reloadDebounce: 3000,
            reloadDelay: 0,
            minify: false,
            ghostMode: {
                clicks: true,
                scroll: true,
                forms: true
            },
            notify: true,
            injectChanges: true, // For CSSes
        }

    },

    // /*
    // Database connection string settings.
    // If 'db' is not set or 'connectionString' does not have db name,
    //     then you can use config.database.connectionDb(dbName) to get the connection string.
    // */
    // database: {
    //
    //     //TODO: ...
    //
    //     format: "mongodb",
    //     username: null,
    //     password: null,
    //     hosts: [
    //         "localhost:27017"
    //     ],
    //     db: null,
    //
    //     /*
    //     If you set this, other parameters will be discarded.
    //     Otherwise, it will be evaluated automatically by other parameters :
    //         "[format://][username:password@]host1[:port1][,host2[:port2],...[,hostN[:portN]]][/database]"
    //     */
    //     connectionString: ""
    // }

};

//\\//\\//\\//\\//\\//\\//\\//\\//\\//\\//\\//\\//\\//\\//\\//\\

//\\//\\//\\//\\//\\//\\//\\//\\//\\//\\//\\//\\//\\//\\//\\//\\

//\\//\\//\\//\\//\\//\\//\\//\\//\\//\\//\\//\\//\\//\\//\\//\\

/*
Set all default values
*/

var temp;

config.port = config.port || process.env['PORT'] || 12345;

config.webapp.offlineCache.cacheManifestUrl = config.webapp.offlineCache.cacheManifestUrl || '/cache-manifest.appcache';
config.webapp.offlineCache.folders = config.webapp.offlineCache.folders || [];
config.webapp.offlineCache.files = config.webapp.offlineCache.files || [];
config.webapp.offlineCache.deps = config.webapp.offlineCache.deps || [];
config.webapp.offlineCache.networks = config.webapp.offlineCache.networks || ['*'];
config.webapp.offlineCache.fallbacks = config.webapp.offlineCache.fallbacks || [];

temp = [];
config.webapp.offlineCache.folders.forEach(folder => {
    if (typeof folder === "string") {
        temp.push([folder, folder, null, null]);
    }
    else if (typeof folder === "object") {
        temp.push([folder[0], folder[1] || folder[0], folder[2] || null, folder[3] || null]);
    }
});
config.webapp.offlineCache.folders = temp;

temp = [];
config.webapp.offlineCache.files.forEach(file => {
    if (typeof file === "string") {
        temp.push([file, file]);
    }
    else if (typeof file === "object") {
        temp.push([file[0], file[1] || file[0]]);
    }
});
config.webapp.offlineCache.files = temp;

config.browserSync.options = config.browserSync.options || {};
config.browserSync.options.proxy = config.browserSync.options.proxy || {};
config.browserSync.options.proxy.target = "localhost:" + config.port;
config.browserSync.options.proxy.ws = true;

(config.browserSync.options.ui === undefined) && (config.browserSync.options.ui = {
    port: config.port + 3,
    weinre: {
        port: config.port + 4
    }
});

config.browserSync.options.socket = config.browserSync.options.socket || {};
config.browserSync.options.socket.path = "/browser-sync/socket.io";
config.browserSync.options.socket.clientPath = "/browser-sync";
config.browserSync.options.socket.namespace = "/browser-sync";
config.browserSync.options.socket.domain = config.browserSync.developOn;

// config.database.hosts = config.database.hosts || [];
// (!config.database.connectionString || (typeof config.database.connectionString !== "string") || (config.database.connectionString === "")) && (config.database.connectionString = (config.database.format ? (config.database.format + "://") : "") + (config.database.username ? (config.database.password ? (config.database.username + ":" + config.database.password + "@") : config.database.username + "@") : "") + config.database.hosts.join(",") + "/" + (config.database.db ? config.database.db : ""));
//
// config.database.connectionDb = dbName => config.database.connectionString + dbName;

//\\//\\//\\//\\//\\//\\//\\//\\//\\//\\//\\//\\//\\//\\//\\//\\

//\\//\\//\\//\\//\\//\\//\\//\\//\\//\\//\\//\\//\\//\\//\\//\\

//\\//\\//\\//\\//\\//\\//\\//\\//\\//\\//\\//\\//\\//\\//\\//\\

module.exports = config;

//\\//\\//\\//\\//\\//\\//\\//\\//\\//\\//\\//\\//\\//\\//\\//\\
