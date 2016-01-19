var dbDetails = require("./dbDetails");
var scottChain = require("./scottchain");

function ConstructUnsignedTransaction(senderId, recipientName, amountToSend, blockChain){

    var total = 0;

    var usersCollection = dbDetails.usersCollection;

    // Asynchronous calls here -- potential cause of issues
    var sender = usersCollection.find({name:senderId});
    var recipient = usersCollection.find({name:recipientName});

    var recipientKey = new scottChain.KeyPair(recipient);
    var senderKey = new scottChain.KeyPair(sender);

    //TODO increment DeriveCount for sender and recipient on DB

    var outputs = [{
        address:recipientKey.getAddress(recipient.maxDeriveCount || 0),
        satoshi:amountToSend
    }];

    var changeAddress = senderKey.getAddress(sender.maxDeriveCount);

    var foundAddress;
    var counter = sender.minDeriveCount;
    var inputs = [];

    //Find unspent addresses for the sender and add to the inputs array
    while (total < amountToSend && counter < sender.maxDeriveCount){
        foundAddress  = blockChain.findUnspentAddress(senderKey.getAddress(counter));
        if(foundAddress){
            inputs.add(foundAddress);
            total += foundAddress.satoshi;
        }
        counter ++;
    }

    if (total >= amountToSend){

        var transaction = new scottChain.Transaction();

        inputs.forEach(function(input) {
            transaction.addInput(input.txHash, input.outputIndex, input.script, input.satoshi);
        });
        outputs.forEach(function(address) {
            transaction.addOutput(address.address, address.satoshi);
        });
        transaction.addChange(changeAddress);

        return transaction;

    }else {
        console.log("NOT ENOUGH MONEY");
        return null;
    }
};

function SignTransaction(request, callback) {

}

module.exports.ConstructUnsignedTransaction = ConstructUnsignedTransaction;
module.exports.SignTransaction = SignTransaction;
