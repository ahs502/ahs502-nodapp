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
