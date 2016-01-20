'use strict';

angular.module('scApp.dashboard', ['ngRoute'])

.config(['$routeProvider', function($routeProvider) {
  $routeProvider.when('/dashboard', {
    templateUrl: 'dashboard/dashboard.html',
    controller: 'DashboardCtrl'
  });
}])

.controller('DashboardCtrl', ['$scope', function($scope) {

	console.log($scope);

	var socketio = io();
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
	});
	$scope.getTransactions = function() {
		console.log("HIT");

		socketio.emit('gettransactions', "ValueA", 0.5);
		console.log("Requested transaction list");
	};

}]);