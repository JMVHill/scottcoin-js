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
	$scope.blocks 				= [];
	$scope.transactions 		= [];
	$scope.selectedTx			= null;
	$scope.selectedBlock		= null;
	$scope.selectedTxKeyValue	= [];

	// Define constant variables
	$scope.MAX_TX 				= 8;
	$scope.MAX_BLOCKS 			= 6;

	// Construct socket object
	var socketio = io();

	// Utility function to merge lists
	function mergeNewItemsToList(list, maxSize, newList) {
		var resultList = list;
		for (var index = 0; index < Math.min(newList.length, maxSize); index ++) {
			resultList.unshift(newList[index]);
		}
		resultList.splice(maxSize);
		return resultList;
	}

	// Display output functions
	$scope.getHashDisplayText = function(hash, length) {
		return hash.substring(0, length) + "...";
	}

	// Utility function to check if a string is blacklisted
	function blackListedString(key) {
		var blackList = ["$$hashKey", "walletconflicts", "txid"];
		for (var index = 0; index < blackList.length; index ++) {
			if (blackList[index] == key) {
				return true;
			}
		}
		return false;
	}

	// Set selected transaction
	$scope.transactionClick = function(tx) {
		$scope.selectedTx = tx;
		$scope.selectedTxKeyValue = [];
		for (var key in tx) {
			if (tx.hasOwnProperty(key) &&
				!blackListedString(key) &&
				tx[key]) {
				$scope.selectedTxKeyValue.push({
					key: key.charAt(0).toUpperCase() + key.slice(1),
					value: tx[key]
				});
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