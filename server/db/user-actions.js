var dbDetails = require("../dbDetails");

module.exports = function(db) {
    var usersCollection = db.collection(dbDetails.usersCollection);

    var getAllUsers = function(callback) {
        usersCollection.find().toArray(function(err,docs) {
            if(!err && docs) callback(docs);
            else callback(false);
        });
    };

    var findUserById = function (userId,callback) {
        usersCollection.find({userId: userId},function(err,doc) {
            if(doc)callback(doc);
            else callback(false);
        });
    };

    var findActiveAddressesByUser = function(userId,callback) {
        usersCollection.find({userId : userId},{active:1, spent:0, userId:0}, function(err,doc){
            if(doc) callback(doc);
            else callback(false);
        });
    };

    var findSpentAddressesByUser = function(userId, callback) {
        usersCollection.find({userId : userId},{active:0, spent:1, userId:0}, function(err,doc){
            if(doc) callback(doc);
            else callback(false);
        });
    };

    var addAddressesToUser


    //Todo Needs a better name
    var updateUserAddress = function(userId, address){
        users.findOne({userId: userId}, function(err,doc){
            if(!err && doc){
                users.update(
                    {userId: userId},
                    {
                        $pull: {active: address},
                        $push: {spent: address}
                    }
                );
            }
        });
        if(callback) callback();
    };

    return {
        getAllUsers: getAllUsers,
        findUserById: findUserById,
        updateUserAddress: updateUserAddress,
        findActiveAddressesByUser: findActiveAddressesByUser,
        findSpentAddressesByUser: findSpentAddressesByUser
    }
};