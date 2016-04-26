var server = require("./server/server");

var port = 8080;

// initDb(function(db) {
// 	server(port, db, {}, function() {
// 	    console.log("Server listening");
// 	});
// });

server(port);
console.log("Server running on port " + port);
