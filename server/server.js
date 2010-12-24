var express = require("express");
var bodyParser = require("body-parser");
var cookieParser = require("cookie-parser");

module.exports = function (port) {

    // Create app and http objects
    var app = express();
    var http = require('http').Server(app);
    var io = require('socket.io')(http);

    // Declare dependencies
    app.use(express.static("public"));
    app.use(cookieParser());
    app.use(bodyParser.json());

    // Declare empty sessiond object
    var sessions = {};

    // HTTP calls
    app.use(function (req, res, next) {
        // if (req.cookies.sessionToken) {
        //     req.session = sessions[req.cookies.sessionToken];
        //     if (req.session) {
        //         next();
        //     } else {
        //         res.sendStatus(401);
        //     }
        // } else {
        //     res.sendStatus(401);
        // }
        next();
    });

    // Pull in json rpc unit
    var jsonRPC = require('./jsonRPC');
    jsonRPC.init();

    // Setup server sockts
    var sockets = require('./sockets');
    sockets.init(io);

    // Pull in chain monitor unit
    var chainMonitor = require('./chainMonitor');
    chainMonitor.start(jsonRPC.getRPCCaller(),
                       sockets.getEmitter(),
                       sockets.registerEvent);

    // Notify port of starting up
    http.listen(port, function () {
        console.log("Http server listening on port " + port);
    });

    var server = app.listen(8102, function() {
        console.log("Rest server listening on port " + 8102);
    });
};
