// AHS502 : Application javascript file :

/*
	AHS502 : Start of 'app/src/modules/ahs-onfline.js'
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
	AHS502 : End of 'app/src/modules/ahs-onfline.js'
*/


/*
	AHS502 : Start of 'app/src/everseen.js'
*/

/*global angular*/

angular.module('OfflineApp', ['ui.router', 'AhsOnfline'])

.run(function() {
    //...
})

.config(["$stateProvider", "$urlRouterProvider", function($stateProvider, $urlRouterProvider) {

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

}])

.controller('MasterController', ["$scope", "$http", function($scope, $http) {

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
