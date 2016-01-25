
function SyncableList(equalCheck, updateCheck, desc) {

	// Save passed params
	this.equalCheck = equalCheck;
	this.updateCheck = updateCheck;

	// Declare list management fields
	this.desc = (desc ? desc : "");
	this.list = [];
	this.buffer = [];
	this.bufferHead = 0;
	this.updated = [];
}

SyncableList.prototype = {

	_saveBufferedList: function(callback, recReversed) {
		if (this.buffer.length > 0) {
			console.log("Added " + this.buffer.length + " new " + this.desc + "(s) now at; " + this.getSize(true) + ".");
			if (recReversed) {
				for (var index = this.buffer.length-1; index > -1; index --) {
					this.list.unshift(this.buffer[index]);
				}
			} else {
				for (var index = 0; index < this.buffer.length; index ++) {
					// console.log("Added block; " + this.buffer[index].hash.substring(0, 8));
					this.list.unshift(this.buffer[index]);
				}
			}
			this.bufferHead = 0;
			if (callback) {
				var cacheBuffer = this.buffer.slice(0);
				this.buffer.splice(0);
				callback(cacheBuffer, this.updated);
			} else {
				this.buffer.splice(0);
			}
		}
	},

	syncList: function(newList, callback, recReversed) {

		// Check if block is head of buffer
		if (this.buffer && this.buffer.length > 0 && newList[0] &&
		   ( (!recReversed && this.equalCheck(this.buffer[this.buffer.length-1], newList[0])) ||
		     (recReversed && this.equalCheck(this.buffer[0], newList[0])) ) ) {
			newList = [];
		}

		// If no new list items are found abort
		var headFound = false;
		if (newList.length != 0) {

			// Add new items's to provided buffer
			for (var itemIndex = 0; itemIndex < newList.length; itemIndex ++) {

				// Check existing new list items
				if (this.list.length == 0 || this.bufferHead == this.list.length) {
					// console.log("QUICK ADD");
					if (recReversed) { this.buffer.push(newList[itemIndex]); }
					else { this.buffer.push(newList[itemIndex]); }
				} else if (!this.list[this.bufferHead]) {
					headFound = true;
				} else {
					if (this.equalCheck(newList[itemIndex], this.list[this.bufferHead])) {
						headFound = true;
					} else {
						if (this.updateCheck(newList[itemIndex], this.list[this.bufferHead])) {
							this.list[this.bufferHead] = newList[itemIndex];
							this.bufferHead += 1;
							if (recReversed) { this.updated.push(newList[itemIndex]); }
							else { this.updated.push(newList[itemIndex]); }
						} else {
							if (recReversed) { this.buffer.push(newList[itemIndex]); }
							else { this.buffer.push(newList[itemIndex]); }
						}
					}
				}
				if (headFound) { break; }
			}
		}

		// Check if buffered new list items need to be saved
		if (this.buffer.length > 0 &&
			(headFound || newList.length == 0)) {
			var bufferedCopy = this.buffer.slice(0);
			this._saveBufferedList(callback, recReversed);
		}

		// Return false if syncing has not finished
		return (headFound || newList.length == 0);
	},

	getSize: function(incBuffered) {
		return this.list.length + (incBuffered ? this.buffer.length : 0);
	},

	getList: function() {
		return this.list;
	}

}


// Export synableList object
module.exports = SyncableList;