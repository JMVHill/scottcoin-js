var userActionsDisconnected = require("./../db/user-actions");
var addressActionsDisconnected = require("./../db/address-actions");
var bodyParser = require("body-parser");
var cookieParser = require("cookie-parser");
var express = require("express");

module.exports = function(server, db) {

    // Declare dependencies
    server.use(bodyParser.json());
    server.use(bodyParser.urlencoded({extended:true}));
    server.use(cookieParser());


    // Setup sessions object
    var sessions = {
        active : {}
    };

    // Bind any incoming request to a session
    // server.use(function (req, res, next) {
    //     if (req.cookies.sessionToken) {
    //         req.session = sessions.active[req.cookies.sessionToken];
    //         if (req.session) {
    //             next();
    //         } else {
    //             res.sendStatus(401);
    //         }
    //     } else {
    //         res.sendStatus(401);
    //     }
    // });

    // Associate session with given user
    //server.get("/user/login", function(req, res) {
    //
    //    // Setup working variables
    //    var username = req.headers.username;
    //    var publicHash = req.headers.public;
    //    var password = req.headers.password;
    //
    //    // Check all required variables are present
    //    if (username && publicHash && password) {
    //
    //        // Register a new user
    //        function registerUser(newUser) {
    //            users.insert(newUser);
    //            console.log("User " + newUser.name + " registered")
    //        }
    //
    //        // Register user with currently active session
    //        function registerWithSession(user) {
    //            console.log("User registered with session.active");
    //            console.log(req.sessions);
    //            // sessions.active[];
    //        }
    //
    //        // FInd user in db and perform login checks
    //        users.findOne({ $or: [
    //                { name: username },
    //                { publicHash: publicHash }
    //            ] }, function(err, user) {
    //            if (!err && user) {
    //                if (user.name == username && user.password == password && user.publicHash == publicHash) {
    //                    console.log("User " + user.name + " logged in");
    //                    registerWithSession(user);
    //                    res.sendStatus(200);
    //                } else {
    //                    console.log("User attempted to login with incorrect credentials");
    //                    res.sendStatus(401);
    //                }
    //            } else {
    //                newUser = { name: username,
    //                            password: password,
    //                            publicHash: publicHash,
    //                            deriveMin: 0,
    //                            deriveMax: 0 };
    //                registerUser(newUser);
    //                registerWithSession(newUser);
    //                res.sendStatus(200);
    //            }
    //        });
    //    } else {
    //        res.sendStatus(500);
    //    }
    //
    //});

    // Generate list of users
    server.get("/users", function(req,res){
        userActions.getAllUsers(function(users) {
            res.json(users);
        });
    });

    //Get all the active addresses for a user
    server.get("user/:userId/active", function(req,res){
        userActions.findActiveAddressesByUser(req.params.userId, function(doc){
            res.json(doc);
        })
    });

    //Get all the active addresses for a user
    server.get("user/:userId/spent", function(req,res){
        userActions.findSpentAddressesByUser(req.params.userId, function(doc){
            res.json(doc);
        })
    });

    //Update an address that has been spent
    server.put("user/:userId/:address", function(req,res) {
        addressActions.updateSpentAddress(req.params.userId,req.params.address);
    });




};
