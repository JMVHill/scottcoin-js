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

	// Format value depending on key
	function createValueForKey(key, value) {
		var dateConvert;
		if (key == "time" ||
			key == "timereceived" ||
			key == "blocktime") {
			value = new Date(value * 1000);
		}
		return {
			key: key.charAt(0).toUpperCase() + key.slice(1),
			value: value
		};
	}

	// Set selected transaction
	$scope.transactionClick = function(tx) {
		$scope.selectedTx = tx;
		$scope.selectedTxKeyValue = [];
		for (var key in tx) {
			if (tx.hasOwnProperty(key) &&
				!blackListedString(key) &&
				tx[key]) {
				$scope.selectedTxKeyValue.push(createValueForKey(key, tx[key]));
			}
		}
		console.log($scope.selectedTxKeyValue);
	}


	// Setup testing socket events
	socketio.on('connect', function() {
		socketio.emit('gettransactions');
		socketio.emit('getblocks');
	});
	socketio.on('newtransactions', function(data) {
		console.log("New transactions");
		console.log(data);
		$scope.transactions = mergeNewItemsToList($scope.transactions, $scope.MAX_TX, data, []);
		$scope.$apply();
	});
	socketio.on('newblocks', function(data) {
		console.log("New blocks");
		console.log(data);
		$scope.blocks = mergeNewItemsToList($scope.blocks, $scope.MAX_BLOCKS, data, []);
		$scope.$apply();
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
	$scope.getBalance = function() {
		socketio.emit('getbalance');
		console.log("Requested balance");
	};

	// Testing methods
	$scope.clickFunction = function() {
		console.log("Test");
	};

	setInterval(function() { $scope.$apply(); }, 1000);

}]);