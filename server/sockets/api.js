
// Import modules
var socketModule = require('./sockets')

// Define values for use between functions
var socketIO;


// Initialise sockets objects
function init(p_socketIO) {

	// Construct socketIO object
	socketIO = new socketModule(p_socketIO);
}

// Return socket emitter methods
function getEmitter(catagory) {
	if (!catagory) {
		return {
			broadcastAll: function(message, data) { return socketIO.broadcastAll(message, data); },
			broadcastSingle: function(socket, message, data) { return socketIO.broadcastSingle(socket, message, data); }
		};
	}
}

// Method to register event with sockets
function registerEvent(eventName, callback) {
	return socketIO.registerEvent(eventName, callback);
}


// Define module exports 
module.exports.init = init;
module.exports.getEmitter = getEmitter;
module.exports.registerEvent = registerEvent;