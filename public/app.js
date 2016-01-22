'use strict';

// Declare app level module which depends on views, and components
angular.module('scApp', [
  'ngRoute',
  'ngMaterial',
  // 'angular-material-data-table',
  'scApp.dashboard'
]).
config(['$routeProvider', function($routeProvider) {
  $routeProvider.otherwise({redirectTo: '/dashboard'});
}]);
