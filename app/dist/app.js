// AHS502 : Application javascript file :

/*
	AHS502 : Start of 'app/src/modules/ahs-onfline.js'
*/

/*global angular*/

angular.module("AhsOnfline", [])
    /*Services*/
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
    /*End*/
;

/*
	AHS502 : End of 'app/src/modules/ahs-onfline.js'
*/


/*
	AHS502 : Start of 'app/src/modules/ahs-syncforage.js'
*/

// /*global localforage*/

// localforage && (function(localforage, global) {

//     var lf = localforage.createInstance({
//         name: "AhsSyncForage_DB"
//     });

    
//     function setItem(key,value,callback){
//         return
//     }
    
//     function getItem(key,callback) {
//         //
//     }
    
//     function removeItem(key,callback){
//         //
//     }
    
    

//     function Item(name) {
//         //...
//     }

//     Item.prototype.set = function Item_set(value, callback) {
//         this.newValue = value;
//         this.modified = true;
//         (typeof callback === "function") && this.commit(callback);
//     };

//     Item.prototype.remove = function Item_remove(callback) {
//         //
//     };

//     Item.prototype.commit = function Item_commit(callback) {
//         //
//     }

//     Item.prototype.get = function Item_get(callback) {
//         //
//     };



//     global["syncforage"] = {
//         //...
//     };

// })(localforage, window);












// // /*global angular*/

// // angular
// //     .module("AhsSyncForage", ['LocalForageModule'])
// //     /*Configurations*/
// //     .config(['$localForageProvider', function($localForageProvider) {

// //         $localForageProvider.config({
// //             name: 'AhsSyncForage_DB', // name of the database and prefix for your data, it is "lf" by default
// //             storeName: 'keyvaluepairs' // name of the table
// //         });

// //     }])
// //     /*Services*/
// //     .service("$syncForage", ['$localForage', '$http', function($localForage, $http) {

// //         this.setItem = function setItem(key, val) {
// //             //...
// //         };

// //         this.getItem = function getItem(key) {
// //             // body...
// //         };

// //         this.removeItem = function removeItem(key) {
// //             // body...
// //         };

// //         this.table=function table(tableName){
// //             return {
// //                 //....
// //             };
// //         };

// //     }])
// //     /*End*/
// // ;


/*
	AHS502 : End of 'app/src/modules/ahs-syncforage.js'
*/


/*
	AHS502 : Start of 'app/src/main.js'
*/

/*global angular*/

var app = angular.module('OfflineApp', ['ui.router', 'AhsOnfline']);

// app.config(["$stateProvider", "$urlRouterProvider", function($stateProvider, $urlRouterProvider) {

//     // Do not allow arbitrary paths :
//     $urlRouterProvider.otherwise("/");

//     // Define system states :
//     $stateProvider
//         .state('home', {
//             url: "/",
//             templateUrl: "/home_template",
//             data: { /*Optional*/ },
//             controller: 'MasterController'
//         })
//         .state('about', {
//             url: "/about",
//             template: "<div><h2>My timer application</h2><h3>A survey on AngularJS applications !</h3></div>"
//         });

// }]);

// app.controller('MasterController', ["$scope", function($scope) {
//     $scope.title = "Everseen!";
// }]);


/*
	AHS502 : End of 'app/src/main.js'
*/


/*
	AHS502 : Start of 'app/src/program/site.js'
*/

/*global app*/

app.run(function() {
    //...
});

app.config(["$stateProvider", "$urlRouterProvider", function($stateProvider, $urlRouterProvider) {

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

}]);

app.controller('MasterController', ["$scope", "$http", function($scope, $http) {

    $scope.title = "Everseen!";

    $scope.dataIn = '- - -';
    $scope.dataOut = {};

    $scope.error = null;

    $scope.setIt = function() {
        $http.post('/set/data', $scope.dataOut).then(function(response) {
            $scope.error = null;
            $scope.dataIn = '- - -';
            alert("DONE!\n" + JSON.stringify(response.data, null, 4));
        }, function(err) {
            $scope.error = err;
        });
    };

    $scope.getAll = function() {
        $http.post('/get/all', {}).then(function(response) {
            $scope.error = null;
            $scope.dataIn = JSON.stringify(response.data, null, 4);
        }, function(err) {
            $scope.error = err;
        });
    };

    $scope.delAll = function() {
        $http.post('/delete/all').then(function(response) {
            $scope.error = null;
            $scope.dataIn = '- - -';
            alert("DONE!\n" + JSON.stringify(response.data, null, 4));
        }, function(err) {
            $scope.error = err;
        });
    };

}]);


/*
	AHS502 : End of 'app/src/program/site.js'
*/
