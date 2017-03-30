var keys = require("./keys.js");
const https = require("https");
const OAuth = require('oauth');

var app = {
	defaultSong: "The Sign",
	defaultMovie: "Mr. Nobody",

	displayTweets: function() {
		var oauth = new OAuth.OAuth(
			'https://api.twitter.com/oauth/request_token',
			'https://api.twitter.com/oauth/access_token',
			keys.twitterKeys.consumer_key,
			keys.twitterKeys.consumer_secret,          
			'1.0A',
			null,
			'HMAC-SHA1'
		);

		oauth.get(
			"https://api.twitter.com/1.1/statuses/user_timeline.json?screen_name=FalkoJulianNoe&count=20",
			keys.twitterKeys.access_token_key,
			keys.twitterKeys.access_token_secret,
			function (e, data, res) {
				if (e) console.error(e);
				JSON.parse(data)
				JSON.parse(data).forEach(function (tweet) {
					console.log();
					console.log("Tweet: '" + tweet.text + "' was created " + tweet.created_at);
				});
			}
		);
	},

	spotifySong: function(song) {
		var options = {
			url: 'https://api.spotify.com/v1/search?q=' + song + "&type=track",
			method: 'GET'
		};
		var req = https.get(options.url, (res) => {
			console.log('statusCode:', res.statusCode);
			console.log('headers:', res.headers);

			res.on('data', (d) => {
				process.stdout.write(d);
			});
		});

		req.on('error', (e) => {
			console.error(e);
		});
		req.end();
	},

	retrieveMovieInfo: function(movie) {

	},

	doWhatItSays: function() {

	},
};

var userCommand = process.argv[2];
if (userCommand === "my-tweets") {
	app.displayTweets();
} else if (userCommand === "spotify-this-song") {
	app.spotifySong(process.argv[3]);
} else if (userCommand === "movie-this") {
	app.retrieveMovieInfo(process.argv[3]);
} else if (userCommand === "do-what-it-says") {
	app.doWhatItSays();
}