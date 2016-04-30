/*global angular*/
angular.module("ngOnflineModule", [])
    /*Service*/
    .service("Onfline", ['$window',
        function($window) {
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
        }
    ])
    /*End*/
;