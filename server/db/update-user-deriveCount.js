module.exports = function(usersCollection){

    return function(user, callback){
        usersCollection.findOne({_id:user.id}, function(err,doc){});
        if(doc){
            usersCollection.update({_id:doc.id},{
                $inc: {maxDeriveCount:1}
            }, {upsert:false});
        }


        if(callback) {
            callback();
        }
    }
};