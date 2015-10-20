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


    // NOTES ON GENERAL TERMINOLOGY
    // 
    // WIF      - Wallet Import/Export Format, encoding private ECDSA key to make it easier to copy
    // ECDSA    - Elliptic Curve Digital Signature Alogrithm, elliptic curve of the digital signature algorithm
    // 
    // 
    // 
    // 
    // 
    // 
    // NOTES ON LIB TERMINOLOGY
    // 
    // .ECPair().makeRandom    - create keyPair object at random from provided 32 character (alphanumeric) string
    // 
    // 
    // 
    // 
    // 
    // 
    // 
    // 

    // ----- TESTING ROUTINES -----
    var assert = require('assert');
    var bigi = require('bigi');
    var bitcoin = require('bitcoinjs-lib');

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

    // Output test results
    console.log("--START TEST--");
    console.log("Address generated: " + generateRandomAddress());
    console.log("--END TEST--");

};
