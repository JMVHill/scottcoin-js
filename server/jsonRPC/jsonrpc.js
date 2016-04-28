
var bitcoin = require('bitcoin');

// Local function for processing errors
function _processErr(err, errCallback) {
	if (err) {
		if (errCallback) {
			errCallback(err);
		} else {
			console.log(err);
		}
		return false;
	}
	return true;
}

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

	getBalance : function(account, minconf, callback, errCallback) {
		if (!account) { account = '*'; }
	    this.client.getBalance(account, minconf, function(err, balance, resHeaders) {
	     	if (_processErr(err, errCallback)) {
	      		if (callback) {
	      			callback(balance);
	      		}
	      	}
	    });
	},

	getUnconfirmedBalance : function(callback, errCallback) {
	    this.client.getUnconfirmedBalance(function(err, balance, resHeaders) {
	     	if (_processErr(err, errCallback)) {
	      		if (callback) {
	      			callback(balance);
	      		}
	      	}
	    });
	},

	getHash: function(height, callback, errCallback) {
		if (!height) { height = 1; }
		this.client.getBlockHash(height, function(err, hash, resHeaders) {
			if (_processErr(err, errCallback)) {
				if (callback) {
					callback(hash);
				}
			}
		});
	},

	getBlock: function(hash, callback, errCallback) {
		if (!hash) { console.log("ERR: Attempted to load a block hash without providing hash.")}
		else {
			this.client.getBlock(hash, function(err, block, resHeaders) {
				if (_processErr(err, errCallback)) {
					if (callback) {
						callback(block);
					}
				}
			});
		}
	},

	getChainHeight: function(callback, errCallback) {
		this.client.getBlockCount(function(err, chainHeight, resHeaders) {
			if (_processErr(err, errCallback)) {
				if (callback) {
					callback(chainHeight)
				}
			}
		});
	},

	listTransactions: function(account, count, skip, callback, errCallback) {
		if (!account) { account = '*'; }
		this.client.listTransactions(account, count, skip, function(err, transactions, resHeaders) {
			if (_processErr(err, errCallback)) {
				if (callback) {
					// order array newest to oldest
					transactions.reverse();
					callback(transactions);
				}
			}
		});
	},

	listBlocks: function(sinceBlock, callback, errCallback) {
		if (!sinceBlock) { console.log("ERR: Attempted to load since a null block."); }
		else {
			this.client.listSinceBlock(sinceBlock, function(err, blocks, resHeaders) {
				if (_processErr(err, errCallback)) {
					if (callback) {
						callback(blocks);
					}
				}
			});
		}
	},

	getNewAddress: function(callback, errCallback) {
		this.client.getNewAddress(function(err, address, resHeaders) {
			if (_processErr(err, errCallback)) {
				if (callback) {
					callback(address);
				}
			}
		});
	},

	sendToAddress: function(address, amount, callback, errCallback) {
		if (!address || !amount) {console.log('ERR: INVALID ADDRESS OR AMOUNT')}
		else{
			this.client.sendToAddress(address, amount, function(err, txHash, resHeaders) {
				if (_processErr(err, errCallback)) {
					if (callback) {
						callback(txHash)
					}
				}
			});
		}
	}
}


// Export json object
module.exports = JsonRPC;