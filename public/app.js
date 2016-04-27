'use strict';

module.exports = (angular) => {

    angular.module('scApp', [
        require('angular-route'),
        require('angular-material'),
        'scApp.dashboard'
    ]).
    config(['$routeProvider', function($routeProvider) {
        $routeProvider.otherwise({redirectTo: '/dashboard'});
    }]);

};
