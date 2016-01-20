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

    // Notify port of starting up
    http.listen(port, function () {
        console.log('listening on *:' + port);
    });

    // Pull in json rpc unit
    var jsonRPC = require('./jsonRPC');
    jsonRPC.init();

    // Pull in chain monitor unit
    var chainMonitor = require('./chainMonitor');
    chainMonitor.start(jsonRPC.getRPCCaller());

    // // Generate random private key
    // var generateRandomPrivateKey = function() {

    //     // Declare working variables
    //     var privateKey = "";
    //     var alphabet = "0123456789ABCDEF";

    //     // Populate private key
    //     for (var index = 0; index < 32; index ++) {
    //          privateKey += alphabet.charAt(Math.floor(Math.random() * alphabet.length));
    //     }

    //     // Return generated private key
    //     var keyObject = BigInteger.fromBuffer(new Buffer(privateKey));
    //     return new bitcoin.ECPair(keyObject, null, {});
    // }

    // // Generate random bitcoin address
    // var generateAddress = function(privateKey) {

    //     // Create new keyPair
    //     var address = privateKey.getAddress();

    //     // Return new address
    //     return address;
    // }

    // // Generate transaction object
    // var generateTransactionObject = function(senderWIF, prevTransactionHash, prevTransactionIndex, destinationAddress, amountSatoshi) {

    //     // Construct transaction objects
    //     var keyPair = bitcoin.ECPair.fromWIF(senderWIF);
    //     var transaction = new bitcoin.TransactionBuilder();

    //     // Add inputs and outputs to object
    //     transaction.addInput(prevTransactionHash, prevTransactionIndex);
    //     transaction.addOutput(destinationAddress, amountSatoshi);
    //     transaction.sign(0, keyPair);

    //     // Return constructed transaction
    //     return transaction.build();
    // }

    // // Run test methods
    // var privateKey = generateRandomPrivateKey();
    // var randomAddress = generateAddress(privateKey);
    // // var customTransaction = generateTransactionObject();

    // // Output test results
    // console.log("--START TEST--");
    // console.log("Primary key generated: " + privateKey.toWIF());
    // console.log("Address generated: " + randomAddress);
    // // console.log("Custom transaction: " + customTransaction.toHex());
    // console.log("--END TEST--");

};
