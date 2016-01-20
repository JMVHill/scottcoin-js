
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
			broadcastAll: function(message, data) { socketIO.broadcastAll(message, data) }
		};
	}
}

// Method to register event with sockets
function registerEvent(eventMessage, callback) {
	return socketIO.registerEvent(eventMessage, callback);
}


// Define module exports 
module.exports.init = init;
module.exports.getEmitter = getEmitter;
module.exports.registerEvent = registerEvent;