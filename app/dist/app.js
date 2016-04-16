// AHS502 : Application javascript file :

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

app.controller('MasterController', ["$scope", function($scope) {
    $scope.title = "Everseen!";
}]);



/*
	AHS502 : End of 'app/src/code/site.js'
*/
