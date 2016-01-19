var userActions = require("./db/user-actions");
var bodyParser = require("body-parser");
var cookieParser = require("cookie-parser");
var express = require("express");
//var config = require("./config");

/*
 * TEST USERS :
 * 
 * {name: "Andy",
 *  password: "5e884898da28047151d0e56f8dc6292773603d0d6aabbdd62a11ef721d1542d8", -- SHA256("password")
 *  deriveMin: 0,
 *  deriveMax: 0,
 *  publicHash : "xpub661MyMwAqRbcFHNoNEHx9xiSEmmAk22NY8jwwLTWEhSyQ9jBWMp6fzP3D2ppGGsdnb6soSFyUo41iYthVNUjptCpD5sK9QgdKoujv68HXx3"}
 * 
 * 
 */

module.exports = function(directoryServer, db) {

    // Declare dependencies
    directoryServer.use(bodyParser.json());
    directoryServer.use(bodyParser.urlencoded({extended:true}));
    directoryServer.use(cookieParser());

    // Initialise db collections
    var users = db.collection("users_test01");

    // Setup sessions object
    var sessions = {
        active : {}
    };

    // Bind any incoming request to a session
    // directoryServer.use(function (req, res, next) {
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
    directoryServer.get("/user/login", function(req, res) {

        // Setup working variables
        var username = req.headers.username;
        var publicHash = req.headers.public;
        var password = req.headers.password;

        // Check all required variables are present
        if (username && publicHash && password) {

            // Register a new user
            function registerUser(newUser) {
                users.insert(newUser);
                console.log("User " + newUser.name + " registered")
            }

            // Register user with currently active session
            function registerWithSession(user) {
                console.log("User registered with session.active");
                console.log(req.sessions);
                // sessions.active[];
            }

            // FInd user in db and perform login checks
            users.findOne({ $or: [
                    { name: username },
                    { publicHash: publicHash }
                ] }, function(err, user) {
                if (!err && user) {
                    if (user.name == username && user.password == password && user.publicHash == publicHash) {
                        console.log("User " + user.name + " logged in");
                        registerWithSession(user);
                        res.sendStatus(200);
                    } else {
                        console.log("User attempted to login with incorrect credentials");
                        res.sendStatus(401);
                    }
                } else {
                    newUser = { name: username,
                                password: password,
                                publicHash: publicHash,
                                deriveMin: 0,
                                deriveMax: 0 };
                    registerUser(newUser);
                    registerWithSession(newUser);
                    res.sendStatus(200);
                }
            });
        } else {
            res.sendStatus(500);
        }

    });

    // Generate list of users
    directoryServer.get("/user/list", function(req,res){
        users.find().toArray(function(err,docs) {
            if(!err) {
                res.json(docs.map(function (user) {
                    return {
                        id: user._id,
                        name: user.name,
                        publicKey: user.publickKey
                    };
                }))
            } else {
                res.sendStatus(500);
            }
        });
    });

    // Request a list of all users outputs
    directoryServer.get("/user/outs", function(req, rest) {

    });

    // Request a list of all users inputs (flagging unspent)
    directoryServer.get("/user/ins", function(req, rest) {

    });

    // Construct transaction from provided recipient and amount
    directoryServer.get("/tx/create", function(req, rest) {



    });
};
