

// Socket IO constructor
function SocketAPI(socketIO) {

	// Socket IO API fields
	this.socketIO = socketIO;

	// Event variables
	this.activeSockets = [];
	this.socketEvents = [];

	// Register core callbacks
	var self = this;
	this.socketIO.on('connection', function(socket) { self.onConnect(socket); });
}

SocketAPI.prototype = {

	_addEventToSocket: function(socket, eventName, callback) {
		socket.on(eventName, callback);
	},

	registerEvent: function(eventName, callback) {
		console.log("THIS IS HIT");
		this.socketEvents.push({
			eventName: eventName,
			callback: callback
		});
			console.log("Socket event registered; '" + eventName + "'");
		for (var index = 0; index < this.activeSockets.length; index ++) {
			this._addEventToSocket(this.activeSockets[index], eventName, callback);
		}
	},

	onConnect: function(socket) {

		// Notify and save new socket connection
		console.log("New connection id; " + socket.client.conn.id);
		this.activeSockets.push(socket);

		// Register core callbacks
		socket.on('disconnect', this.onDisconnect);

		// Add any events applicable to connection
		var self = this;
		for (var index = 0; index < this.socketEvents.length; index ++) {
			this._addEventToSocket(socket,
				this.socketEvents[index].eventName,
				this.socketEvents[index].callback);//.bind(this, socket)); -useful code!
		}
	},

	onDisconnect: function() {
		console.log("disconnect occured");
	},

	broadcastAll: function(message, data) {
		this.socketIO.emit(message, data);
	},

	broadcastSingle: function(socket, message, data) {
		socket.emit(message, data);
	}
}


// Export chain monitor object
module.exports = SocketAPI;