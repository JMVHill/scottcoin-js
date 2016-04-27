'use strict';


module.exports = (angular) => {

    angular.module('scApp', [
        require('angular-route'),
        require('angular-material'),
        'scApp.dashboard',
        'scApp.wallet'
    ]).
    config(['$routeProvider', function($routeProvider) {
        $routeProvider.otherwise({redirectTo: '/dashboard'});
    }]).
    controller('tabsController', function($location) {
        this.state = $location.path();
        this.go = function(path) {
            $location.path(path);
        };
    });
};
