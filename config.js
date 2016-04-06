var config = {

    /* Local port to run Node.js server on for development, 12345 by default */
    nodePort: 8081, // 5 ports will be reserved (from nodePort to nodePort+4).

    /* Server IP address */
    serverIp: "176.9.194.237",

    buildPaths: {

        lib: {

            /* List of all javascript files of client-side modules */
            js: [
                "./app/lib/angular/angular.min.js",
                "./app/lib/angular-ui-router/release/angular-ui-router.min.js",
                "./app/lib/jquery/dist/jquery.min.js",
                "./app/lib/semantic/dist/semantic.min.js",
                "./app/lib/ui-router-extras/release/ct-ui-router-extras.min.js",
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
            */
            src: "./app/src/",

            /*
            The path containing *.css and *.less stylesheet files.
            You can use arbitrary directory structure to manage stylesheet files.
            Files within inner directories will be composed SOONER.
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
        
    }

};

//\\//\\//\\//\\//\\//\\//\\//\\//\\//\\//\\//\\//\\//\\//\\//\\

//\\//\\//\\//\\//\\//\\//\\//\\//\\//\\//\\//\\//\\//\\//\\//\\

//\\//\\//\\//\\//\\//\\//\\//\\//\\//\\//\\//\\//\\//\\//\\//\\

/*
Set all default values
*/

config.nodePort = config.nodePort || 12345;

config.dns = config.dns || {};

config.nginx = config.nginx || {};

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

for (var domain in config.dns) {
    if ((domain in config.nginx) && !("www." + domain in config.nginx)) {
        config.nginx[domain + " www." + domain] = config.nginx[domain];
        delete config.nginx[domain];
    }
}

//\\//\\//\\//\\//\\//\\//\\//\\//\\//\\//\\//\\//\\//\\//\\//\\

//\\//\\//\\//\\//\\//\\//\\//\\//\\//\\//\\//\\//\\//\\//\\//\\

//\\//\\//\\//\\//\\//\\//\\//\\//\\//\\//\\//\\//\\//\\//\\//\\

module.exports = config;

//\\//\\//\\//\\//\\//\\//\\//\\//\\//\\//\\//\\//\\//\\//\\//\\
