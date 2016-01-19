var dbDetails = require("../dbDetails");

module.exports = function(db) {
    var usersCollection = db.collection(dbDetails.usersCollection);

    var findUserByName = function (name) {
        usersCollection.findOne({name: name},function(err,doc) {
            if(doc) {
                callback(doc);
            } else {
                callback(false);
            }
        });
    };

    var findUserById = function (id) {;
        usersCollection.findOne({_id: id},function(err,doc) {
            if(doc) {
                callback(doc);
            } else {
                callback(false);
            }
        });
    };

    return {
        findUserByName: findUserByName,
        findUserById: findUserById
    }
};