var config = {

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

        /* Public contents */
        assets: [
            "./app/assets/**/*.*",
            "./public/**/*.*"
        ]

    },

    nodePort: 12345,

    /* Server IP address */
    serverIp: "136.243.163.18",

    /* dns :
    Bind9 name server configurations.
    First domain will be used for reverse zone.
    Bu default we have :
        ["ns1"] for ns,
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
            subdomains: ["www", "ide", "test"],
            // data: {
            //     "ns1": "A",
            //     "mail": "A",
            //     "www": "CNAME",
            //     "ide": "A",
            //     "test": "A",
            // }
        },

        "hesamhesab.ir": {
            subdomains: ["www", "ide", "test"]
        }

    },

    /*
    Nginx server configurations.
    You can proxy each domain (with any subdomains if you want) to a specified url.
    */
    nginx: {
        "ahs502.ir": "http://localhost:8081",
        "www.ahs502.ir": "http://localhost:8081",
        "ide.ahs502.ir": "http://localhost:8080",
        "hesamhesab.ir": "http://localhost:8082",
        "www.hesamhesab.ir": "http://localhost:8082",
        "ide.hesamhesab.ir": "http://localhost:8080",
    }

};


module.exports = config;
