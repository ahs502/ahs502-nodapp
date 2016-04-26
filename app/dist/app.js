// AHS502 : Application javascript file :

/*
	AHS502 : Start of 'app/src/lib/offline-storage.js'
*/



/*
	AHS502 : End of 'app/src/lib/offline-storage.js'
*/


/*
	AHS502 : Start of 'app/src/main.js'
*/

/*global angular*/

var app = angular.module('OfflineApp', ['ui.router']);

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
	AHS502 : Start of 'app/src/code/site.js'
*/

/*global app*/

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

    $scope.getIt = function() {
        $http.post('/get/data', {}).then(function(response) {
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
	AHS502 : End of 'app/src/code/site.js'
*/
