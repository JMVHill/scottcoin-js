'use strict';

angular.module('scApp.dashboard', ['ngRoute'])

.config(['$routeProvider', function($routeProvider) {
  $routeProvider.when('/dashboard', {
    templateUrl: 'dashboard/dashboard.html',
    controller: 'DashboardCtrl'
  });
}])

.controller('DashboardCtrl', ['$scope', function($scope) {

	// Define core variables
	$scope.transactions = [];

	// Construct socket object
	var socketio = io();

	// Setup testing socket events
	socketio.on('connect', function() {
		socketio.emit('gettransactions');
	});
	socketio.on('newtransactions', function(data) {
		console.log("New transactions message");
		console.log(data);
	});
	socketio.on('updatetransactions', function(data) {
		console.log("Update transactions message");
		console.log(data);
	});
	socketio.on('sendtransactions', function(data) {
		console.log("Received transaction list");
		console.log(data);
		$scope.transactions = data;
		$scope.$apply();
	});

	// Get a list of transactions on function call
	$scope.getTransactions = function() {
		socketio.emit('gettransactions');
		console.log("Requested transaction list");
	};

	// Testing methods
	$scope.clickFunction = function() {
		console.log("Test");
	};

}]);