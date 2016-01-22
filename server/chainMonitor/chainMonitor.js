
// Import modules
var syncableModule = require('./syncableList')


// Chain monitor constructor
function ChainMonitor() {

	// Synable lists
	this.blockList = new syncableModule(function(b1, b2) { return b1.hash == b2.hash; },
										function(b1, b2) { return false; }, "block");
	this.txList = new syncableModule(function(tx1, tx2) { return ( (tx1.txid == tx2.txid) && (tx1.blockhash == tx2.blockhash) ); },
									 function(tx1, tx2) { return (tx1.txid == tx2.txid); }, "tx")
}

ChainMonitor.prototype = {

	_txLocked: function(tx) {
		return (tx.blockhash);
	},

	syncTransactions: function(transactions, callback) {
		return this.txList.syncList(transactions, callback, true);
	},

	getTransactions: function(count, skip, locked, unlocked) {

		// Declare working variables
		var resultList = [];
		var tx = this.txList.getList();
		var either = false;
		var counter = 0;

		// If neither is specified get both
		if (!locked && !unlocked) {
			locked = true;
			unlocked = true;
			either = true;
		}

		// Search through list
		for (var index = 0; index < tx.length; index ++) {
			if ( (counter >= skip) &&
				(either ||
				(unlocked && !_txLocked(tx[index])) ||
				(locked && _txLocked(tx[index])) ) ) {
				resultList.push(tx[index]);
				if (resultList.length >= count) { break; }
			}
			if (skip > 0) { counter += 1; }
		}

		// Return calculated result
		return resultList;
	},

	syncBlocks: function(blocks, callback) {
		return this.blockList.syncList(blocks, callback, false);
	},

	getBlocks: function(count, skip) {

		// Declare working variables
		var resultList = [];
		var blocks = this.blockList.getList();
		var counter = 0;

		// Search through list
		for (var index = 0; index < blocks.length; index ++) {
			if (counter >= skip) {
				resultList.push(blocks[(skip == -1 ? blocks.length - 1 - index : index)]);
				if (resultList.length >= count) { break; }
			}
			if (skip > 0) { counter += 1; }
		}

		// Return calculated result
		return resultList;
	},

	getBlockCount: function(incBuffer) {
		return this.blockList.getSize(incBuffer);
	}
}


// Export chain monitor object
module.exports = ChainMonitor;