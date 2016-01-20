

// Chain monitor constructor
function ChainMonitor() {

	// Transaction fields
	this.tx = [];
	this.txBuffer = [];
	this.txBufferHead = 0;
	this.updatedTx = [];
}

ChainMonitor.prototype = {

	_txEqual: function(tx1, tx2, blockExempt) {
		return (tx1.txid == tx2.txid &&
			    (tx1.blockhash == tx2.blockhash || blockExempt));
	},

	_txLocked: function(tx) {
		return (tx.blockhash);
	},

	_txNotInBuffer: function(tx) {
		for (var checkTx in this.txBuffer) {
			if (this._txEqual(checkTx, tx)) {
				return true;
			}
		}
		return false;
	},

	_saveBufferedTx: function() {
		console.log("Added " + this.txBuffer.length + " new transactions.");
		for (var index = this.txBuffer.length-1; index > -1; index --) {
			this.tx.unshift(this.txBuffer[index]);
		}
		this.txBuffer = [];
	},

	syncTransactions: function(transactions, callback) {

		// If no more transactions are found abort
		var txHeadFound = false;
		if (transactions.length != 0) {

			// Add new tx's to txBuffer
			for (var txIndex = 0; txIndex < transactions.length; txIndex ++) {

				// Check existing transactions
				if (this.tx.length == 0 || this.txBufferHead == this.tx.length) {
					this.txBuffer.push(transactions[txIndex]);
				} else {
					if (this._txEqual(transactions[txIndex], this.tx[this.txBufferHead])) {
						txHeadFound = true;
					} else {
						if (this._txEqual(transactions[txIndex], this.tx[this.txBufferHead], true)) {
							this.tx[this.txBufferHead] = transactions[txIndex];
							this.txBufferHead += 1;
							this.updatedTx.push(transactions[txIndex]);
							// console.log("TX UPDATED; HEAD AT " + this.txBufferHead);
						} else {
							this.txBuffer.push(transactions[txIndex]);
							// console.log("Buffered 1 transaction.");
						}
					}
				}
				if (txHeadFound) { break; }
			}
		}

		// Check if buffered transactions need to be saved
		if (this.txBuffer.length > 0 &&
			(txHeadFound || transactions.length == 0)) {
			var bufferedTxCopy = this.txBuffer.slice(0);
			this._saveBufferedTx();
			this.txBufferHead = 0;
			if (callback) { callback(bufferedTxCopy, this.updatedTx) };
			this.updatedTx = [];
		}

		// console.log(transactions);
		return (txHeadFound || transactions.length == 0);
	},

	getTransactions: function(count, skip, locked, unlocked) {

		// Declare working variables
		var resultList = [];
		var either = false;
		var counter = 0;

		// If neither is specified get both
		if (!locked && !unlocked) {
			locked = true;
			unlocked = true;
			either = true;
		}

		// Search through list
		for (var index = 0; index < this.tx.length; index ++) {
			if ( (counter >= skip) &&
				(either ||
				(unlocked && !this._txLocked(this.tx[index])) ||
				(locked && this._txLocked(this.tx[index])) ) ) {
				resultList.push(this.tx[index]);
				if (this.tx.length >= count) { break; }
			}
			counter += 1;
		}

		console.log(resultList);

		// Return calculated result
		return resultList;
	}
}


// Export chain monitor object
module.exports = ChainMonitor;