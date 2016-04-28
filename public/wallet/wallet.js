'use strict';

module.exports = (angular, socketio) => {

    angular.module('scApp.wallet', ['ngRoute'])

    .config(['$routeProvider', function($routeProvider) {
        $routeProvider.when('/wallet', {
            //templateUrl: './wallet/wallet.html',
            template: require('./wallet.html'),
            controller: 'WalletCtrl'
        });
    }])

    .controller('WalletCtrl', ['$scope', function($scope) {

        // Define core variables
        $scope.balance = 0;
        $scope.unconfirmedBalance = 0;
        $scope.address = '';
        $scope.recipient = {
            address: "",
            amount: null
        };
        $scope.txHash = '';

        // Get a list of transactions on function call
        $scope.getBalance = () => {
            socketio.emit('getbalance');
            console.log('Requested balance');
        };

        $scope.getUnconfirmedBalance = () => {
            socketio.emit('getunconfirmedbalance');
            console.log('Requested Unconfirmed balance');
        };

        $scope.getNewAddress = () => {
            socketio.emit('getnewaddress');
            console.log('Requested new Addresss');
        };

        $scope.pay = (recipient) => {
            socketio.emit('sendtoaddress', recipient);
            console.log('Paying ' + recipient.amount + 'SCO to ' + recipient.address);
        };

        socketio.on('sendbalance', (data) => {
            console.log('Received account balance: ' + data);
            $scope.balance = data;
            $scope.$apply();
        });

        socketio.on('sendunconfirmedbalance', (data) => {
            //console.log('Received account unconfirmed balance: ' + data);
            $scope.unconfirmedBalance = data;
            $scope.$apply();
        });

        socketio.on('sendnewaddress', (data) => {
            console.log('Received new Address ' + data);
            $scope.address = data;
            $scope.$apply();
        });

        socketio.on('confirmedpayment', (data) => {
            console.log('Payment confirmed, Hash: ' + data);
            $scope.txHash = data;
            $scope.recipient = {
                address: '',
                amount: null
            };
            $scope.$apply();
        });

        socketio.reconnect();

        setInterval(function() { $scope.$apply(); }, 1000);
    }]);
};
