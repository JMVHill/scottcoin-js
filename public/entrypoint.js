
// Import css
require('./app.css');

// Import major modules
let angular = require('angular');
let sockets = require('socket.io-client');

// Import angular web modules
let initDashboard = require('./dashboard/dashboard.js');
let initAngular = require('./app.js');

// Construct web modules
let angularApp = initAngular(angular);
let dashboardPartial = initDashboard(angular, sockets);
