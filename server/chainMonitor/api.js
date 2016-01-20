
// Import modules
var monitorModule = require('./chainMonitor')

// Define values for use between functions
var chainMonitor;
var rpcCaller;
var monitorThread;


// Start an instance of a monitor thread
function start(p_rpcCaller) {

	// Check monitor is not already running
	if (monitorThread) { console.err("ERR: Attempted to create monitor thread but cannot run multiple instances.");	}

	// Save reference to rpcCaller
	rpcCaller = p_rpcCaller;

	// Create instance of chainMonitor
	chainMonitor = new monitorModule();

	// Main monitor thread --deal with second instance of function calling when existing has not yet finished
	monitorThread = setInterval(function() {

		// Update list of transactions
		(function processTxUpdate(count, skip) {
			if (!skip) { skip = 0; }
			rpcCaller.listTransactions('*', count, skip, function(transactions) {
				if (!chainMonitor.syncTransactions(transactions)) {
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