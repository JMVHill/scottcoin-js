
// Import modules


// Define values for use between functions


// Setup the rest server object
function init(app) {

	// Add test get function
	app.get('/pubkey', function(req, res) {
		res.json("048dd6e1740da50f44c8e1c67eb25d0494c81fe96730ca1680ecfb45d83d23ad40a40cb0584cbae2caf62b591b864c264848710de2874a93fd5b824b73032a42ad");
	});

}


// Define module exports
module.exports.init = init;