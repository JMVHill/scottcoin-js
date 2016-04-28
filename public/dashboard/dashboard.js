'use strict';

module.exports = (angular, socketio) => {

    angular.module('scApp.dashboard', ['ngRoute'])

    .config(['$routeProvider', function($routeProvider) {
        $routeProvider.when('/dashboard', {
            template: require('./dashboard.html'),
            // templateUrl: '/dashboard/dashboard.html',
            controller: 'DashboardCtrl'
        });
    }])

    .controller('DashboardCtrl', ['$scope', function($scope) {

        // Define core variables
        $scope.blocks = [];
        $scope.transactions = [];
        $scope.selectedTx = null;
        $scope.selectedBlock = null;
        $scope.selectedTxKeyValue = [];
        $scope.selectedBlockKeyValue = [];

        // Define constant variables
        $scope.MAX_TX = 8;
        $scope.MAX_BLOCKS = 6;

        // Define 'constants'
        var txKeys = ['account', 'address', 'amount', 'blockhash', 'blockindex', 'blocktime',
                      'catagory', 'confirmations', 'generated', 'time', 'timereceived', 'vout'];
        var blockKeys = ['bits', 'chainwork', 'confirmations', 'difficulty', 'height', 'merkleroot',
                         'nonce', 'previousblockhash', 'signature', 'size', 'time', 'tx', 'version'];

        // Utility function to merge lists
        let mergeNewItemsToList = (list, maxSize, newList) => {
            var resultList = list;
            for (var index = 0; index < Math.min(newList.length, maxSize); index ++) {
                resultList.unshift(newList[index]);
            }
            resultList.splice(maxSize);
            return resultList;
        };

        // Get mode for working panel
        $scope.viewerMode = (modeCheck) => {
            return (modeCheck === 'transactionInspect' &&
                        $scope.selectedTx &&
                        !$scope.selectedBlock) ||
                   (modeCheck === 'blockInspect' &&
                        !$scope.selectedTx &&
                        $scope.selectedBlock) ||
                   (modeCheck === 'nothingSelected' &&
                        !$scope.selectedTx &&
                        !$scope.selectedBlock);
        };

        // Display output functions
        $scope.getHashDisplayText = (hash, length) => {
            return hash.substring(0, length) + '...';
        };

        // Return elapsed time between now and value
        $scope.elapsedTime = (value) => {
            var nowTime = new Date().getTime();
            var dateConvert = new Date(value * 1000);
            dateConvert = new Date(nowTime - dateConvert);
            return dateConvert;
        };
        $scope.formatDate = (date) => {
            var hours = date.getHours();
            var mins = date.getMinutes();
            var seconds = date.getSeconds();
            return (hours.toString().length === 1 ? '0' + hours : hours) + ':' +
                   (mins.toString().length === 1 ? '0' + mins : mins) + ':' +
                   (seconds.toString().length === 1 ? '0' + seconds : seconds);
        };

        // Format value depending on key
        let createValueForKey = (key, value) => {
            var dateConvert;
            if (key === 'time' ||
                key === 'timereceived' ||
                key === 'blocktime') {
                value = new Date(value * 1000);
            }
            return {
                key: key.charAt(0).toUpperCase() + key.slice(1),
                value: value
            };
        };

        // Utility function to check if a string is blacklisted
        let blackListedString = (key) => {
            var blackList = ['$$hashKey', 'walletconflicts', 'txid'];
            for (var index = 0; index < blackList.length; index ++) {
                if (blackList[index] === key) {
                    return true;
                }
            }
            return false;
        };

        // Set selected transaction
        let resetSelectedItems = () => {
            $scope.selectedTx = null;
            $scope.selectedBlock = null;
        };
        let createKeyValueArray = (sourceObject, keyArray) => {
            if (!keyArray) { return []; }
            var resultArray = [];
            for (var key in sourceObject) {
                if (sourceObject.hasOwnProperty(key) &&
                    keyArray.indexOf(key) !== -1 &&
                    sourceObject[key]) {
                    resultArray.push(createValueForKey(key, sourceObject[key]));
                }
            }
            return resultArray;
        };
        $scope.transactionClick = (tx) => {
            resetSelectedItems();
            $scope.selectedTx = tx;
            $scope.selectedTxKeyValue = createKeyValueArray(tx, txKeys);
        };
        $scope.blockClick = (block) => {
            resetSelectedItems();
            $scope.selectedBlock = block;
            $scope.selectedBlockKeyValue = createKeyValueArray(block, blockKeys);
        };

        socketio.on('newtransactions', (data) => {
            console.log('New transactions');
            console.log(data);
            $scope.transactions = mergeNewItemsToList($scope.transactions, $scope.MAX_TX, data, []);
            $scope.$apply();
        });
        socketio.on('newblocks', (data) => {
            console.log('New blocks');
            console.log(data);
            $scope.blocks = mergeNewItemsToList($scope.blocks, $scope.MAX_BLOCKS, data, []);
            $scope.$apply();
        });
        socketio.on('updatetransactions', (data) => {
            console.log('Update transactions');
            console.log(data);
        });
        socketio.on('sendtransactions', (data) => {
            console.log('Received transaction list');
            console.log(data);
            $scope.transactions = data;
            $scope.$apply();
        });
        socketio.on('sendblocks', (data) => {
            console.log('Received block list');
            console.log(data);
            $scope.blocks = data;
            $scope.$apply();
        });

        // Get a list of transactions on function call
        $scope.getPullList = () => {
            socketio.emit('gettransactions');
            socketio.emit('getblocks');
            console.log('Requested transaction and block list');
        };
        $scope.getPullAll = () => {
            socketio.emit('alltransactions');
            socketio.emit('allblocks');
            console.log('Requested transaction and block list');
        };

        socketio.reconnect();

        setInterval(() => { $scope.$apply(); }, 1000);

    }]);

};
