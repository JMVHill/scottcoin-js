'use strict';

module.exports = (angular, sockets) => {

    angular.module('scApp.wallet', ['ngRoute'])

    .config(['$routeProvider', function($routeProvider) {
      $routeProvider.when('/wallet', {
        template: require('wallet.html'),
        controller: 'WalletCtrl'
      });
    }])

    .controller('WalletCtrl', ['$scope', function($scope) {

        // Define core variables
        $scope.balance              = 70.00;
        $scope.unconfirmedBalance   = 0;
        $scope.address = '';

        $scope.recipient = {
            address: null,
            amount: null
        };

        // Construct socket object
        var socketio = io();


        // Get a list of transactions on function call
        $scope.getBalance = function() {
            socketio.emit("getbalance");
            console.log("Requested balance");
        };



        $scope.getUnconfirmedBalance = function() {
            socketio.emit("getUnconfirmedbalance");
            console.log("Requested balance");
        };

        $scope.getNewAddress = function() {
            socketio.emit("getNewAddress");
            console.log("Request new Addresss")
        }

        socketio.on('getbalance', function(data) {
            console.log("Received account balance");
            console.log(data);
            $scope.balance = data;
            $scope.$apply();
        });


        socketio.on('getUnconfirmedbalance', function(data) {
            console.log("Received account unconfirmed balance");
            console.log(data);
            $scope.unconfirmedBalanceBalance = data;
            $scope.$apply();
        });

        setInterval(function() { $scope.$apply(); }, 1000);
    }]);

};