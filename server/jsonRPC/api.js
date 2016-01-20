
// Import modules
var rpcModule = require('./jsonrpc')

// Define values for use between functions
var jsonRPC;


// Initialiser function
function init() {

	// Initialise client
	jsonRPC = new rpcModule('127.0.0.1', 8101, 'jhill', 'password', 30000);

	// Run test methods
	jsonRPC.getBalance('*', 1, function(balance) { console.log("Server wallet balance; " + balance); });

}

// RPC API retriever
function getRPCCaller() {
	return {
		getBalance: function(account, minconf, callback) { return jsonRPC.getBalance(account, minconf, callback); },
		listTransactions: function(account, count, skip, callback) { return jsonRPC.listTransactions(account, count, skip, callback); }
	};
}


// Define module exports
module.exports.init = init;
module.exports.getRPCCaller = getRPCCaller;