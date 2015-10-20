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



    // ----- TESTING ROUTINES -----
    var assert = require('assert');
    var bigi = require('bigi');
    var bitcoin = require('bitcoinjs-lib');

    // Generate random private key
    var generateRandomPrivateKey = function() {

        // Declare working variables
        var privateKey = "";
        var alphabet = "0123456789ABCDEF";

        // Populate private key
        for (var index = 0; index < 64; index ++) {
             privateKey += alphabet.charAt(Math.floor(Math.random() * alphabet.length));
        }

        // Return generated private key
        return privateKey;
    }

    // Generate random bitcoin address
    var generateRandomAddress = function() {

        // Function for random source string to construct address from
        var randomSource = function() {
            var outputString = "";
            var alphabet = "abcdefghijklmnopqrstuvwxyz";
            for (var index = 0; index < 32; index ++) {
                outputString += alphabet.charAt(Math.floor(Math.random() * alphabet.length));
            }
            return new Buffer(outputString);
        }

        // Create new keyPair
        var keyPair = bitcoin.ECPair.makeRandom({ rng: randomSource });
        var address = keyPair.getAddress();

        // Return new address
        return address;
    }

    // Generate transaction object
    var generateTransactionObject = function() {

    }

    // Run test methods
    var privateKey = generateRandomPrivateKey();
    var randomAddress = generateRandomAddress();

    // Output test results
    console.log("--START TEST--");
    console.log("Primary key generated: " + privateKey);
    console.log("Address generated: " + randomAddress);
    console.log("--END TEST--");

};
