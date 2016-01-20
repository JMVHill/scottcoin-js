
// Import modules
var monitorModule = require('./chainMonitor')

// Define values for use between functions
var chainMonitor;
var rpcCaller;
var socketEmitter;
var monitorThread;

// Define constants
const SCT_SND__NEW_TX = 'newtransactions';
const SCT_SND__UPDATE_TX = 'updatetransactions';


// Start an instance of a monitor thread
function start(p_rpcCaller, p_socketEmitter) {

	// Check monitor is not already running
	if (monitorThread) { console.err("ERR: Attempted to create monitor thread but cannot run multiple instances.");	}

	// Save reference to rpcCaller
	rpcCaller = p_rpcCaller;
	socketEmitter = p_socketEmitter;

	// Create instance of chainMonitor
	chainMonitor = new monitorModule();

	// Callback function on event of new transactions found
	var newTransactionCallback = function(newTx, updatedTx) {
		if (newTx && newTx.length > 0)			{ socketEmitter.broadcastAll(SCT_SND__NEW_TX, newTx); }
		if (updatedTx && updatedTx.length > 0)	{ socketEmitter.broadcastAll(SCT_SND__NEW_TX, updatedTx); }
	}

	// Main monitor thread --need to deal with second instance of function calling when existing has not yet finished
	monitorThread = setInterval(function() {

		// Update list of transactions, calling for next set of tx's if current ones are all new
		(function processTxUpdate(count, skip) {
			if (!skip) { skip = 0; }
			rpcCaller.listTransactions('*', count, skip, function(transactions) {
				if (!chainMonitor.syncTransactions(transactions, newTransactionCallback)) {
					processTxUpdate(count, count + skip);
				}
			});
		})(2);

	}, 2000);
}

// Halt a running instance of a monitor thread
function stop() {
	if (monitorThread) {
		clearInterval(monitorThread);
		monitorThread = null;
	} else {
		console.err("ERR: Attempted to halt monitor thread but no instance existed.")
	}
}


// Define module exports 
module.exports.start = start;