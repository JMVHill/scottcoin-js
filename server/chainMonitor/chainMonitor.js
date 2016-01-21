

// Chain monitor constructor
function ChainMonitor() {

	// Block fields
	this.blocks = [];
	this.blockBuffer = [];
	this.blockBufferHead = 0;
	this.blockUpdated = [];

	// Transaction fields
	this.tx = [];
	this.txBuffer = [];
	this.txBufferHead = 0;
	this.txUpdated = [];
}

ChainMonitor.prototype = {

	_syncLists: function(listData, newList, callback) {

		// If no new list items are found abort
		var headFound = false;
		if (newList.length != 0) {

			// Add new items's to provided buffer
			for (var itemIndex = 0; itemIndex < newList.length; itemIndex ++) {

				// Check existing new list items
				if (listData.list.length == 0 || listData.bufferHead == listData.list.length) {
					listData.buffer.push(newList[itemIndex]);
				} else {
					if (listData.equalCheck(newList[itemIndex], listData.list[listData.bufferHead])) {
						headFound = true;
					} else {
						if (listData.updateCheck(newList[itemIndex], listData.list[listData.bufferHead])) {
							listData.list[listData.bufferHead] = newList[itemIndex];
							listData.bufferHead += 1;
							listData.updated.push(newList[itemIndex]);
						} else {
							listData.buffer.push(newList[itemIndex]);
						}
					}
				}
				if (headFound) { break; }
			}
		}

		// Check if buffered new list items need to be saved
		if (listData.buffer.length > 0 &&
			(headFound || newList.length == 0)) {
			var bufferedCopy = listData.buffer.slice(0);
			listData.saveBuffered();
			listData.bufferHead = 0;
			if (callback) { callback(bufferedCopy, listData.updated) };
			listData.updated = [];
		}

		// Return false if syncing has not finished
		return (headFound || newList.length == 0);
	},

	_txLocked: function(tx) {
		return (tx.blockhash);
	},

	_saveBufferedTx: function() {
		if (this.txBuffer.length > 0) {
			console.log("Added " + this.txBuffer.length + " new transactions.");
			for (var index = this.txBuffer.length-1; index > -1; index --) {
				this.tx.unshift(this.txBuffer[index]);
			}
			this.txBuffer = [];
		}
	},

	_saveBufferedBlocks: function() {
		if (this.blockBuffer.length > 0) {
			console.log("Added " + this.blockBuffer.length + " new blocks.");
			for (var index = this.blockBuffer.length-1; index > -1; index --) {
				this.blocks.unshift(this.blockBuffer[index]);
			}
			this.blockBuffer = [];
		}
	},

	syncTransactions: function(transactions, callback) {

		// Create self reference
		var self = this;

		// Create list data object
		var listData = {
			list: 			this.tx,
			buffer: 		this.txBuffer,
			bufferHead: 	this.txBufferHead,
			equalCheck: 	function(tx1, tx2) { return (tx1.txid == tx2.txid && tx1.blockhash == tx2.blockhash); },
			updateCheck: 	function(tx1, tx2) { return (tx1.txid == tx2.txid); },
			updated:  		this.txUpdated,
			saveBuffered: 	function() { return self._saveBufferedTx(); }
		};

		// Return generic list comparison result
		return this._syncLists(listData, transactions, callback);
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
				if (resultList.length >= count) { break; }
			}
			if (skip > 0) { counter += 1; }
		}

		// Return calculated result
		return resultList;
	},

	syncBlocks: function(blocks, callback) {

		// Create self reference
		var self = this;

		// Create list data object
		var listData = {
			list: 			this.blocks,
			buffer: 		this.blockBuffer,
			bufferHead: 	this.blockBufferHead,
			equalCheck: 	function(b1, b2) { return (b1.hash == b2.hash); },
			updateCheck: 	function(b1, b2) { return false; },
			updated:  		this.blockUpdated,
			saveBuffered: 	function() { return self._saveBufferedBlocks(); }
		};

		// Return generic list comparison result
		return this._syncLists(listData, blocks, callback);
	},

	getBlocks: function(count, skip) {

	}
}


// Export chain monitor object
module.exports = ChainMonitor;