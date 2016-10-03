// ===============================================================================
// LOAD DATA
// We are linking our routes to a "data" source.
// This data source holds arrays of information on users, survey results, etc.
// ===============================================================================

var friendData 		= require('../data/friends.js');


// ===============================================================================
// ROUTING
// ===============================================================================

module.exports = function (app) {
	// API GET Requests
	// Below code handles when users "visit" a page.
	// In each of the below cases when a user visits a link
	// (ex: localhost:PORT/api/admin... they are shown a JSON of the data)
	// ---------------------------------------------------------------------------

	app.get('/api/friends', function (req, res) {
		res.json(friendData);
	});

	// API POST Requests
	// Below code handles when a user submits a form and thus submits data to the server.
	// In each of the below cases, when a user submits form data (a JSON object)
	// ...the JSON is pushed to the appropriate Javascript array
	// (ex. User fills out the survey... this data is then sent to the server...
	// Then the server saves the data to the friendData array)
	// ---------------------------------------------------------------------------

	app.post('/api/friends', function (req, res) {
		// Note the code here. Our "server" will respond to requests and handle incoming survey results.
		// It will also handle the compatibility logic.


		// Converts the survey scores from str to int
		for (var i=0; i<req.body.scores.length; i++) {
			var integerized = parseInt(req.body.scores[i]);
			req.body.scores[i] = integerized;
		}

		// Saves the data
		friendData.push(req.body);
		console.log("User's scores: " + req.body.scores);

		// Compatibility logic
		var bestMatch = 0;
		var lowestDifference = 40;  // The highest difference possible with 10 questions

		// For each friend
		for (var i=0; i<friendData.length - 1; i++) {
			console.log("Friend #" + i + "'s scores: " + friendData[i].scores);
			
			var totalDifference = 0;

			// Calculates the sum of the score differences between the user and the particular friend
			for (var j=0; j<friendData[i].scores.length; j++) {
				totalDifference += Math.abs(friendData[i].scores[j] - req.body.scores[j]);
			}

			console.log(totalDifference);

			// Checks for compatibility (least amount of difference in scores)
			if (totalDifference < lowestDifference) {
				bestMatch = i;
				lowestDifference = totalDifference;
			}
		}

		// Sends the most compatible friend data to the modal
		res.send(friendData[bestMatch]);

		console.log("Best match: " + bestMatch);
		console.log("Lowest diff: " + lowestDifference);
		console.log("---------------------------------");
	});
};