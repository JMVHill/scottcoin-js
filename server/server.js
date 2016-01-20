var api = require("./rest/api");
var express = require("express");
var bodyParser = require("body-parser");
var cookieParser = require("cookie-parser");
var http = require('http');

module.exports = function (port, db, activeSessions) {

    // Create app and http objects
    var app = express();
    var server = http.Server(app);

    // Declare dependencies
    app.use(express.static("public/app"));
    app.use(cookieParser());
    app.use(bodyParser.json());
    
    // Construct Directory and ScottChain api
    api(app, db, activeSessions || []);

    // // Declare empty session object
    // var sessions = {};

    // // HTTP calls
    // app.use(function (req, res, next) {
    //     if (req.cookies.sessionToken) {
    //         req.session = sessions[req.cookies.sessionToken];
    //         if (req.session) {
    //             next();
    //         } else {
    //             res.sendStatus(401);
    //         }
    //     } else {
    //         res.sendStatus(401);
    //     }
    // });

    // Set app to listen to REST port
    app.listen(port, null);

    // Test for signature generation

    // Test using provided dummy data
    // ScottChain.Test.TestChainConstruction();

    // Test using data generated and chained through three transactions
    // ScottChain.Test.GenerateDummyData();

    // Test randomally traded transactions using varying parameters
    // No. Of bots, min/max tx per block, min/max blocks
    // ScottChain.Test.BotTester(5, {min:1, max:2}, {min:2, max:3});

};
