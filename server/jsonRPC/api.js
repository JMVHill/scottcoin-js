
// Import modules
var rpcModule = require('./jsonrpc')

// Define values for use between functions
var jsonRPC;


// Initialiser function
function init() {

	// Initialise client
	jsonRPC = new rpcModule('127.0.0.1', 8101, 'scottnet', 'password', 30000);

	// Run test methods
	jsonRPC.getBalance('*', 1, function(balance) { console.log("Server wallet balance; " + balance); });

}

// RPC API retriever
function getRPCCaller() {
	return {

		getBalance:            function(account, minconf, callback, errCallback)
			{ return jsonRPC.getBalance(account, minconf, callback, errCallback); },

		getUnconfirmedBalance: 			  function(callback, errCallback)
			{ return jsonRPC.getUnconfirmedBalance(callback, errCallback); },
			
		getHash:            function(height, callback, errCallback)
			{ return jsonRPC.getHash(height, callback, errCallback); },

		getBlock:            function(hash, callback, errCallback)
			{ return jsonRPC.getBlock(hash, callback, errCallback); },

		getChainHeight:            function(callback, errCallback)
			{ return jsonRPC.getChainHeight(callback, errCallback); },

		listTransactions:            function(account, count, skip, callback, errCallback)
			{ return jsonRPC.listTransactions(account, count, skip, callback, errCallback); },
			
		listBlocks:            function(sinceBlock, callback, errCallback)
			{ return jsonRPC.listBlocks(sinceBlock, callback, errCallback); },

		getNewAddress:        	  function(account, callback, errCallback)
			{ return jsonRPC.getNewAddress(account, callback, errCallback); },

		sendToAddress: 			  function(address, amount, callback, errCallback)
			{ return jsonRPC.sendToAddress(address, amount, callback, errCallback); }
	};
}


// Define module exports
module.exports.init = init;
module.exports.getRPCCaller = getRPCCaller;