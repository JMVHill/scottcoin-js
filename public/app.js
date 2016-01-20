'use strict';

// Declare app level module which depends on views, and components
angular.module('scApp', [
  'ngRoute',
  'scApp.view1',
  'scApp.view2',
  'scApp.dashboard'
]).
config(['$routeProvider', function($routeProvider) {
  $routeProvider.otherwise({redirectTo: '/dashboard'});
}]);
