var server = require("./server/server");

var port = 8001;

initDb(function(db) {
    server(port, db, {}, function() {
        console.log("Server listening");
    });
});
console.log("Server running on port " + port);
