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