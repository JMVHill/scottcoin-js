'use strict';

let angular = require('angular');

// Declare app level module which depends on views, and components
angular.module('scApp', [
    'ngRoute',
    'ngMaterial',
    'scApp.dashboard'
]).
config(['$routeProvider', function($routeProvider) {
    $routeProvider.otherwise({redirectTo: '/dashboard'});
}]);
