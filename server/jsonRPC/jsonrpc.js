
var bitcoin = require('bitcoin');

function JsonRPC(host, port, user, password, timeout) {

	// Create client object
    this.client = new bitcoin.Client({
        host: host,
        port: port,
        user: user,
        pass: password,
        timeout: timeout
    });
}
JsonRPC.prototype = {

	getBalance : function(account, minconf, callback) {
		if (!account) { account = '*'; }
	    this.client.getBalance(account, minconf, function(err, balance, resHeaders) {
	     	if (err) {
	     		console.log(err)
			} else {
	      		if (callback) {
	      			callback(balance);
	      		}
	      	}
	    });
	},

	listTransactions: function(account, count, skip, callback) {
		if (!account) { account = '*'; }
		this.client.listTransactions(account, count, skip, function(err, transactions, resHeaders) {
			if (err) {
				console.log(err);
			} else {
				if (callback) {
					// order array newest to oldest
					transactions.reverse();
					callback(transactions);
				}
			}
		});
	}
}


// Export json object
module.exports = JsonRPC;