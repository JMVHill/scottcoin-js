/**
 * Created by jmorris on 20/01/2016.
 */
var dbDetails = require("../dbDetails");

module.exports = function(db) {

    var activeAddresses = db.collection(dbDetails.activeAddressesCollection);
    var spentAddresses = db.collection(dbDetails.spentAddressesCollection);

    var findUserBySpentAddress = function(userId) {
        spentAddresses.findOne({user: userId},{user:1,_id:0}, function(err,doc){
            if(doc) callback(doc);
            else callback(false);
        });
    };

    var updateAddress = function(userId, address){
        //Find user and remove link to the address
        activeAddresses.find({address: address}, function(err,doc){
            if(!err && doc){
                //Move address from active to spent collections
                spentAddresses.insert(doc);
                activeAddresses.remove(doc);
            }
        });
        if(callback) callback();
    };

    var addNewAddress = function(address,userId) {
        activeAddresses.insert({address: address, userId: userId});
    };


    return{
        updateAddress: updateAddress,
        findUserBySpentAddress: findUserBySpentAddress,
        addNewAddress: addNewAddress
    }
};