
// Import css
require('./app.css');

// Import major modules
let angular = require('angular');
let sockets = require('socket.io-client');

// Construct and tweak socket object
let socketio = sockets();
socketio.scottcoinConnected = false;
socketio.firstConnectDataPoll = () => {
    socketio.emit('gettransactions');
    socketio.emit('getblocks');
    socketio.emit('getbalance');
    socketio.emit('getunconfirmedbalance');
};
socketio.reconnect = () => {
    let timeoutCallback = () => {
        if (socketio.scottcoinConnected) {
            socketio.firstConnectDataPoll();
        } else {
            setTimeout(timeoutCallback, 100);
        }
    };
    timeoutCallback();
};

// Import angular web modules
let initAngular = require('./app.js');
let initDashboard = require('./dashboard/dashboard.js');
let initWallet = require('./wallet/wallet.js');

// Construct web modules
let angularApp = initAngular(angular);
let dashboardPartial = initDashboard(angular, socketio);
let walletPartial = initWallet(angular, socketio);

// Setup testing socket events
socketio.on('connect', () => {
    socketio.firstConnectDataPoll();
    socketio.scottcoinConnected = true;
});
