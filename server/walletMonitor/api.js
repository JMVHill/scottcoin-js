// Import modules
var monitorModule = require('./walletMonitor')


// Improt constants
const SCOTTCOIN = require('../enums/scottcoin.js');
const SOCKETS = require('../enums/sockets.js');


// Define values for use between functions
var walletMonitor;
var rpcCaller;
var socketEmitter;
var monitorThread;

// Start an instance of a monitor thread
function start(p_rpcCaller, p_socketEmitter, p_socketRegisterEvent) {

    // Check monitor is not already running
    if (monitorThread) { console.err("ERR: Attempted to create monitor thread but cannot run multiple instances."); }

    // Save reference to rpcCaller
    rpcCaller = p_rpcCaller;
    socketEmitter = p_socketEmitter;
    socketRegisterEvent = p_socketRegisterEvent;

    // Create instance of walletMonitor
    walletMonitor = new monitorModule();

    // Main monitor thread --need to deal with second instance of function calling when existing has not yet finished
    monitorThread = setInterval(function() {
    
        //Update Balance
        rpcCaller.getBalance('*', 1, function(balance) {
            socketEmitter.broadcastAll(SOCKETS.SCT_SND__BALANCE, balance);
        });

        //Update Unconfirmed balance
        rpcCaller.getUnconfirmedBalance(function(unconfirmedBalance) {
            socketEmitter.broadcastAll(SOCKETS.SCT_SND__UNCONFBALANCE, unconfirmedBalance);
        });

    }, 2000, true);

    // Thread to repeatedly attempt to gather the genesis block hash (rather one higher than genesis)
    (function getGenesisHash() {
        if (!SCOTTCOIN.GENESIS_HASH) {
            rpcCaller.getHash(1, function(hash) {
                SCOTTCOIN.GENESIS_HASH = hash;
            });
            setTimeout(getGenesisHash, 500);
        } else {
            console.log("Wallet: Found genesis hash: " + SCOTTCOIN.GENESIS_HASH.substring(0, 12) + "...");
        }
    })();

    // Register events for responding to client get requests
    socketRegisterEvent(SOCKETS.SCT_REC__BALANCE, function() {
        socketEmitter.broadcastSingle(this, SOCKETS.SCT_SND__BALANCE, walletMonitor.getBalance());
    });

    socketRegisterEvent(SOCKETS.SCT_REC__UNCONFBALANCE, function() {
        socketEmitter.broadcastSingle(this, SOCKETS.SCT_SND__UNCONFBALANCE, walletMonitor.getUnconfirmedBalance());
    });

    socketRegisterEvent(SOCKETS.SCT_REC__GET_ADDR, function() {
        var self = this;
        rpcCaller.getNewAddress(function(address) {
            socketEmitter.broadcastSingle(self, SOCKETS.SCT_SND__GET_ADDR, walletMonitor.getNewAddress(address));
        })
    });

    socketRegisterEvent(SOCKETS.SCT_REC__PAYMENT, function(recipient) {
        var self = this;
        rpcCaller.sendToAddress(function(recipient) {
            socketEmitter.broadcastSingle(self, SOCKETS.SCT_SND__PAYMENT walletMonitor.getNewAddress(address));
        })
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