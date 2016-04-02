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

    nodePort: 8081,

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
            subdomains: ["www", "ide", "dev", "bs", "test"],
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
            subdomains: ["www", "ide", "dev", "bs", "test"]
        }

    },

    /*
    Nginx server configurations.
    You can proxy each domain (with any subdomains if you want) to a specified url.
    The acceptable format is (by examples) :
        {
            "domain1.some": "http://localhost:8080",
            "sub1.domain1.some1": "http://localhost:8081",
            "sub2.domain1.some2": "http://localhost:8082",
            "domain2.some3": "http://localhost:8082/path1",
            "sub3.domain2.some3": "http://localhost:8082/path2",
            "sub3.domain1.some1": {
                "path3": "http://localhost:8086",
                "/path4": "http://localhost:8087",
                "path5": "http://localhost:8088/path6",
                ...
            },
            ...
        }
    NOTE:   If you map 'domain.ir/zxc' to 'somewhereelse', then
            a request to 'domain.ir/zxc' will be redirected to 'somewhereelse/zxc' ('/zxc' will not be discarded) and
            a request to 'domain.ir/zxc/asd' will be redirected to 'somewhereelse/zxc/asd'.
    */
    nginx: {

        "ahs502.ir": "http://localhost:8081",
        "www.ahs502.ir": "http://localhost:8081",
        // "dev.ahs502.ir": "http://localhost:8082",
        "dev.ahs502.ir/zxc": "http://localhost:8011",
        "dev.ahs502.ir/qwe": "http://localhost:8022",
        "bs.ahs502.ir": "http://localhost:8083",
        "test.ahs502.ir": "http://localhost:8084",
        "ide.ahs502.ir": "http://localhost:8080",

        "hesamhesab.ir": "http://localhost:8091",
        "www.hesamhesab.ir": "http://localhost:8091",
        "dev.hesamhesab.ir": "http://localhost:8092",
        "bs.hesamhesab.ir": "http://localhost:8093",
        "test.hesamhesab.ir": "http://localhost:8094",
        "ide.hesamhesab.ir": "http://localhost:8080",

    }

};


module.exports = config;
