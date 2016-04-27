
// Import css
require('./app.css');

// Import major modules
let angular = require('angular');
let sockets = require('socket.io-client');
let socketio = sockets();

// Import angular web modules
let initAngular = require('./app.js');
let initDashboard = require('./dashboard/dashboard.js');
let initWallet = require('./wallet/wallet.js');

// Construct web modules
let angularApp = initAngular(angular);
let dashboardPartial = initDashboard(angular, socketio);
let walletPartial = initWallet(angular, socketio);
