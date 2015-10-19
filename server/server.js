var express = require("express");
var bodyParser = require("body-parser");
var cookieParser = require("cookie-parser");

module.exports = function (port) {

    // Create app and http objects
    var app = express();
    var http = require('http').Server(app);

    // Declare dependencies
    app.use(express.static("public"));
    app.use(cookieParser());
    app.use(bodyParser.json());

    // Declare empty sessiond object
    var sessions = {};

    // HTTP calls

    app.use(function (req, res, next) {
        if (req.cookies.sessionToken) {
            req.session = sessions[req.cookies.sessionToken];
            if (req.session) {
                next();
            } else {
                res.sendStatus(401);
            }
        } else {
            res.sendStatus(401);
        }
    });

    http.listen(port, function () {
        console.log('listening on *:' + port);
    });
};
