

// Socket IO constructor
function SocketAPI(socketIO) {

	// Socket IO API fields
	this.socketIO = socketIO;

	// Event variables
	this.socketEvents = [];

	// Register core callbacks
	var self = this;
	this.socketIO.on('connection', function(socket) { self.onConnect(socket); });
}

SocketAPI.prototype = {

	registerEvent: function(eventName, callback) {
		this.socketEvents.push({
			eventName: eventName,
			callback: callback
		});
		console.log("Socket event registered; '" + eventName + "'");
	},

	onConnect: function(socket) {
		console.log("New connection id; " + socket.client.conn.id);
		socket.on('disconnect', this.onDisconnect);
	},

	onDisconnect: function(arg1, arg2, arg3) {
		console.log("disconnect occured");
	},

	broadcastAll: function(message, data) {
		this.socketIO.emit(message, data);
	}
}


// Export chain monitor object
module.exports = SocketAPI;