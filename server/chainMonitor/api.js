
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
const SCT_SND__TX_LIST = 'sendtransactions';
const SCT_REC__TX_LIST = 'gettransactions';


// Start an instance of a monitor thread
function start(p_rpcCaller, p_socketEmitter, p_socketRegisterEvent) {

	// Check monitor is not already running
	if (monitorThread) { console.err("ERR: Attempted to create monitor thread but cannot run multiple instances.");	}

	// Save reference to rpcCaller
	rpcCaller = p_rpcCaller;
	socketEmitter = p_socketEmitter;
	socketRegisterEvent = p_socketRegisterEvent;

	// Create instance of chainMonitor
	chainMonitor = new monitorModule();

	// Callback function on event of new transactions found
	var newTransactionCallback = function(newTx, updatedTx) {
		if (newTx && newTx.length > 0)			{ socketEmitter.broadcastAll(SCT_SND__NEW_TX, newTx); }
		if (updatedTx && updatedTx.length > 0)	{ socketEmitter.broadcastAll(SCT_SND__UPDATE_TX, updatedTx); }
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

		//

	}, 2000);

	// Register events for responding to client get requests
	socketRegisterEvent(SCT_REC__TX_LIST, function() {
		socketEmitter.broadcastSingle(this, SCT_SND__TX_LIST, chainMonitor.getTransactions(8, 0));
	});
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