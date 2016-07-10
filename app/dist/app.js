// AHS502 : Application javascript file :

/*
	AHS502 : Start of 'app/src/modules/modules/ahs-onfline.js'
*/

/*global angular*/

angular.module("AhsOnfline", [])

.service("Onfline", ['$window', function($window) {
    this.isOnline = function() {
        return !!$window.navigator.onLine;
    };
    this.isOffline = function() {
        return !$window.navigator.onLine;
    };
    this.whenOnline = function(whatToDo) {
        $window.addEventListener("online", whatToDo);
    };
    this.whenOffline = function(whatToDo) {
        $window.addEventListener("offline", whatToDo);
    };
}])

;

/*
	AHS502 : End of 'app/src/modules/modules/ahs-onfline.js'
*/


/*
	AHS502 : Start of 'app/src/modules/ahs-syncforage.js'
*/

/*global angular*/
/*global localforage*/

angular.module("AhsSyncForage", ['AhsOnfline'])

.provider("SyncForage", function() {

    var options = {
            /* LocalForage specific */
            name: "AhsSyncForage_DB",
            storeName: 'keyvaluepairs',
            /* SyncForage specific */
            syncURL: '/syncforage',
            autoSync: true,
            autoSyncPeriod: 60, // sec
            versionFieldName: "AhsSyncForage_Version"
        },
        lf = null;

    function configure(newOptions) {
        angular.extend(options, newOptions);
    }

    return {

        config: configure,

        $get: ['$http', '$q', 'Onfline', function($http, $q, onfline) {

            var cache = {}, // Cache for stored items
                changed = [], // List of updated keys that are not synchronized yet
                removed = [], // List of removed keys that are not synchronized yet
                initPromise = null; // If not null, the promise that should be resolved for initialization

            changed.push(options.versionFieldName);

            initialize();

            return {

                config: function(newOptions) {
                    configure(newOptions);
                    initialize();
                }, // (options)

                setItem: setItem, // (key, value [,cb])
                getItem: getItem, // (key [,cb])
                removeItem: removeItem, // (key [,cb])
                sync: sync, // ([cb])

                syncURL: syncURL, // () Get / (url) Set the URL to syncronize to.
                autoSync: autoSync, // () Get / (active) Set status of the ability to automatic synchronization.
                getLocalForageInstance: getLocalForageInstance, // () Get instance of localForage which is being used for SyncForage.

                test: test,

            };

            function test() {

                configure({
                    autoSync: false
                });

                function lg(zxc) {
                    return function() {
                        console.log(zxc + "   Cache: ", JSON.stringify(cache));
                        console.log(zxc + "   Changed: ", JSON.stringify(changed));
                        console.log(zxc + "   Removed: ", JSON.stringify(removed));
                    };
                }

                // (setItem('a', 12345).then(lg('a added')))
                //     .then((setItem('b', "BBBBBBB").then(lg('b added')))
                //         .then(sync().then(lg('syncronized'))))

                /*/
                                setItem('a', 45678, function() {
                                    lg('a added')()
                                    setItem('b', "BBBBBBBBBB", function() {
                                        lg('b added')()
                                        sync(function() {
                                            lg('sync!')()
                                            removeItem('b', function() {
                                                lg('b removed')()
                                                setItem('c', 'CCCCCCCC', function() {
                                                    lg('c added')()
                                                    getItem('a', function(data) {
                                                        console.log("A = ", data)
                                                        lg('a readed')()
                                                        sync(function() {
                                                            lg('done!')()
                                                        })
                                                    })
                                                })
                                            })
                                        })
                                    })
                                })
                //*/

                /*/
                                getItem('a', function(data) {
                                    console.log("A = ", data)
                                    lg('a readed')()
                                    getItem('b', function(data) {
                                        console.log("B = ", data)
                                        lg('b readed')()
                                        getItem('c', function(data) {
                                            console.log("C = ", data)
                                            lg('c readed')()
                                            sync(function() {
                                                lg('done!')()
                                            })
                                        })
                                    })
                                })
                //*/

                /*/
                                // configure({
                                //     autoSync: false
                                // });

                                // cache = {
                                //     "a": 123,
                                //     "b": 456,
                                //     "c": 789
                                // };

                                // removeItem("b").then(function() {
                                //     console.log("cache:", cache);
                                //     console.log("removed:", removed);
                                //     console.log("changed:", changed);
                                //     removeItem("b").then(function() {
                                //         console.log("cache:", cache);
                                //         console.log("removed:", removed);
                                //         console.log("changed:", changed);
                                //         sync(function () {
                                //             console.log("DONE!");
                                //         })
                                //     }, function(err) {
                                //         alert(err);
                                //     });

                                // }, function(err) {
                                //     alert(err);
                                // });
                //*/

                /*/
                                // cache = "Some cache ...";
                                // changed = changed.concat(["some", "other", "keys"]);
                                // removed = removed.concat(["keys", "to be", "removed"]);

                                // sync(function(err) {
                                //     if (err)
                                //         alert("Error.");
                                //     else
                                //         alert("DONE!");
                                //     sync(function(err) {
                                //         if (err)
                                //             alert("Error.");
                                //         else
                                //             alert("DONE!");
                                //     });
                                // });
                //*/

            }

            function initialize() {
                if (!options.autoSync) {
                    lf = localforage.createInstance(options);
                    initPromise=null;
                }else
                {
                    onfline.whenOnline(function() {
                        sync();
                    });
                    //...
                    //TODO: sync() & fill initPromise
                }
            }

            function setItem(key, value, callback) {
                _checkInitialization();
                var promise;
                if (key == options.versionFieldName) {
                    promise = $q.when();
                }
                else {
                    promise = lf.setItem(key, value).then(function() {
                        _removeItemFromList(removed, key);
                        _addItemToList(changed, key);
                        cache[key] = value;
                    });
                    if (options.autoSync) {
                        promise = promise.then(sync());
                    }
                }
                return _applyCallbackToPromise(callback, promise);
            }

            function getItem(key, callback) {
                _checkInitialization();
                var promise;
                if (Object.keys(cache).indexOf(key) >= 0) {
                    promise = $q.when(cache[key]);
                }
                else if (removed.indexOf(key) >= 0) {
                    promise = $q.when(undefined);
                }
                else {
                    promise = lf.getItem(key).then(function(value) {
                        cache[key] = value;
                        return value;
                    });
                }
                return _applyCallbackToPromise(callback, promise, true);
            }

            function removeItem(key, callback) {
                _checkInitialization();
                var promise;
                if (key == options.versionFieldName) {
                    promise = $q.when();
                }
                else {
                    if (!_addItemToList(removed, key)) {
                        promise = $q.when();
                    }
                    else {
                        _removeItemFromList(changed, key);
                        promise = lf.removeItem(key);
                    }
                    if (options.autoSync) {
                        promise = promise.then(sync());
                    }
                }
                promise = promise.then(function() {
                    delete cache[key];
                });
                return _applyCallbackToPromise(callback, promise);
            }

            function sync(callback) {
                _checkInitialization();
                var itemsToBeSent = {},
                    retriverPromises = [];
                changed.forEach(function(key) {
                    if (cache[key] !== undefined) {
                        itemsToBeSent[key] = cache[key];
                    }
                    else {
                        retriverPromises.push(lf.getItem(key).then(function(value) {
                            itemsToBeSent[key] = (key != options.versionFieldName) ? (value || null) : (value || 0);
                        }));
                    }
                });
                var promise = $q.all(retriverPromises).then(function() {
                    var config = {};
                    return $http.post(options.syncURL, {
                            items: itemsToBeSent,
                            changed: changed,
                            removed: removed
                        }, config)
                        .then(function(response) {
                            changed = [options.versionFieldName];
                            removed = [];
                            var serverItems = response.data.items || {},
                                serverChanged = response.data.changed || [],
                                serverRemoved = response.data.removed || [];
                            retriverPromises = [];
                            serverChanged.forEach(function(key) {
                                retriverPromises.push(lf.setItem(key, serverItems[key]).then(function() {
                                    cache[key] = serverItems[key];
                                }));
                            });
                            serverRemoved.forEach(function(key) {
                                retriverPromises.push(lf.removeItem(key).then(function() {
                                    delete cache[key];
                                }));
                            });
                            return $q.all(retriverPromises);
                        });
                });
                return _applyCallbackToPromise(callback, promise);
            }

            function syncURL(url) {
                return url ? (options.syncURL = url) : options.syncURL;
            }

            function autoSync(active) {
                return (active === undefined) ? options.autoSync : (options.autoSync = active);
            }

            function getLocalForageInstance() {
                return lf;
            }

            function _applyCallbackToPromise(callback, promise, withData) {
                if (typeof callback === 'function') {
                    return promise.then(function(data) {
                        callback(data);
                    }, function(err) {
                        if (withData) {
                            callback(undefined, err);
                        }
                        else {
                            callback(err);
                        }
                    });
                }
                else {
                    return promise;
                }
            }

            function _addItemToList(list, item) {
                var index = list.indexOf(item);
                if (index < 0) {
                    list.push(item);
                }
                return index < 0;
            }

            function _removeItemFromList(list, item) {
                var index = list.indexOf(item);
                if (index >= 0) {
                    list.splice(index, 1);
                }
                return index >= 0;
            }

            function _checkInitialization() {
                if (!lf)
                    throw new Error("AhsSyncForage is not initialized yet. Please configure SyncForageProvider.config([options]) first.");
            }

        }]
    };

})

;


/*
	AHS502 : End of 'app/src/modules/ahs-syncforage.js'
*/


/*
	AHS502 : Start of 'app/src/everseen.js'
*/

/*global angular*/

angular.module('Everseen', ['ui.router', 'AhsSyncForage'])

.run(function() {
    //...
})

.config(["$stateProvider", "$urlRouterProvider", "SyncForageProvider", function($stateProvider, $urlRouterProvider, syncForageProvider) {

    // Do not allow arbitrary paths :
    $urlRouterProvider.otherwise("/");

    // Define system states :
    $stateProvider
        .state('home', {
            url: "/",
            templateUrl: "/home_template",
            data: { /*Optional*/ },
            controller: 'MasterController'
        })
        .state('about', {
            url: "/about",
            template: "<div><h2>My timer application</h2><h3>A survey on AngularJS applications !</h3></div>"
        });

    // Testing AhsSyncForage :
    syncForageProvider.config({
        syncURL: '/everseen/syncforage'
    });

}])

.controller('MasterController', ["$scope", "$http", "SyncForage", function($scope, $http, syncForage) {

    $scope.title = "Everseen!";

    $scope.dataIn = '- - -';
    $scope.dataOut = {};

    $scope.error = null;

    $scope.setIt = function() {
        $http.post('/everseen/set/data', $scope.dataOut).then(function(response) {
            $scope.error = null;
            $scope.dataIn = '- - -';
            alert("DONE!\n" + JSON.stringify(response.data, null, 4));
        }, function(err) {
            $scope.error = err;
        });
    };

    $scope.getAll = function() {
        $http.post('/everseen/get/all', {}).then(function(response) {
            $scope.error = null;
            $scope.dataIn = JSON.stringify(response.data, null, 4);
        }, function(err) {
            $scope.error = err;
        });
    };

    $scope.delAll = function() {
        $http.post('/everseen/delete/all').then(function(response) {
            $scope.error = null;
            $scope.dataIn = '- - -';
            alert("DONE!\n" + JSON.stringify(response.data, null, 4));
        }, function(err) {
            $scope.error = err;
        });
    };

    $scope.testIt = function() {
        syncForage.test();
    };

}])

;


/*
	AHS502 : End of 'app/src/everseen.js'
*/


/*
	AHS502 : Start of 'app/src/main.js'
*/

// Client-side scripts ...


/*
	AHS502 : End of 'app/src/main.js'
*/
