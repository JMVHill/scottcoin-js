
// Import modules
//


// Setup the rest server
function init(app) {

	// Add test get function
	app.get('/pubkey', function(req, res) {
		res.json("04b5a312930ae32f927f7cdda07202e679bfb63634fd71b882568e6f81d074fb3b29fe179756304c1648c47d2ecb3648893585f434760704c4170f8af31673e398");
	});

}


// Define module exports
module.exports.init = init;