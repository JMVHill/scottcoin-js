var mongoClient = require("mongodb").MongoClient;
var dbConnectionString = require("../dbDetails");

module.exports = function(callback) {
    mongoClient.connect(dbConnectionString.connectionString, function(err, db) {
        if(!err && db) {
            callback(db);
        } else {
            callback(null, err);
        }
    });
};
