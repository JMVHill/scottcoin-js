'use strict';

angular.module('scApp.wallet', ['ngRoute'])

.config(['$routeProvider', function($routeProvider) {
  $routeProvider.when('/wallet', {
    templateUrl: 'wallet/wallet.html',
    controller: 'WalletCtrl'
  });
}])

.controller('WalletCtrl', ['$scope', function($scope) {

	// Define core variables
	$scope.balance				= null;
	$scope.unconfirmedbalance	= null;
	$scope.newAddress = '';
	$scope.recipient = {
		address: null,
		amount: null
	};

	// Construct socket object
	var socketio = io();

	
	// Return elapsed time between now and value
	$scope.elapsedTime = function(value) {
		var nowTime = new Date().getTime();
		var dateConvert = new Date(value * 1000);
		dateConvert = new Date(nowTime - dateConvert);
		return dateConvert;
	}
	$scope.formatDate = function(date) {
		var hours = date.getHours();
		var mins = date.getMinutes();
		var seconds = date.getSeconds();
		return (hours.toString().length == 1 ? "0" + hours : hours) + ":" + 
		       (mins.toString().length == 1 ? "0" + mins : mins) + ":" + 
		       (seconds.toString().length == 1 ? "0" + seconds : seconds);
	}

	// Get a list of transactions on function call
	$scope.getBalance = function() {
		socketio.emit("getbalance");
		console.log("Requested balance");
	};


	$scope.getNewAddress = function() {
		socketio.emit("getNewAddress");
		console.log("Request new Addresss")
	}



	setInterval(function() { $scope.$apply(); }, 1000);

}]);