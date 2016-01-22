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
	$scope.blocks = [];
	$scope.transactions = [];

	// Construct socket object
	var socketio = io();

	// Setup testing socket events
	socketio.on('connect', function() {
		socketio.emit('gettransactions');
		socketio.emit('getblocks');
	});
	socketio.on('newtransactions', function(data) {
		console.log("New transactions");
		console.log(data);
	});
	socketio.on('newblocks', function(data) {
		console.log("New blocks");
		console.log(data);
	});
	socketio.on('updatetransactions', function(data) {
		console.log("Update transactions");
		console.log(data);
	});
	socketio.on('sendtransactions', function(data) {
		console.log("Received transaction list");
		console.log(data);
		$scope.transactions = data;
		$scope.$apply();
	});
	socketio.on('sendblocks', function(data) {
		console.log("Received block list");
		console.log(data);
		$scope.blocks = data;
		$scope.$apply();
	});

	// Get a list of transactions on function call
	$scope.getPullList = function() {
		socketio.emit('gettransactions');
		socketio.emit('getblocks');
		console.log("Requested transaction and block list");
	};
	$scope.getPullAll = function() {
		socketio.emit('alltransactions');
		socketio.emit('allblocks');
		console.log("Requested transaction and block list");
	};

	// Testing methods
	$scope.clickFunction = function() {
		console.log("Test");
	};

}]);