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
