var keys = require("./keys.js");
const https = require("https");
const OAuth = require('oauth');
const popsicle = require('popsicle');
const fs = require('fs');

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
		popsicle.get("https://api.spotify.com/v1/search?q=" + song + "&type=track")
			.use(popsicle.plugins.parse(['json', 'urlencoded']))
			.then((res) => {
				if (!res.body.tracks.items) {
					popsicle.get("https://api.spotify.com/v1/tracks/" + res.body.tracks.items[0].id)
						.use(popsicle.plugins.parse(['json', 'urlencoded']))
						.then((res) => {
							console.log("Song Name: " + res.body.name);
							console.log("Artist Name: " + res.body.artists[0].name);
							console.log("Preview: " + res.body.preview_url);
							console.log("Album Name: " + res.body.album.name);
						});
				} else {
					popsicle.get("https://api.spotify.com/v1/tracks/0hrBpAOgrt8RXigk83LLNE")
						.use(popsicle.plugins.parse(['json', 'urlencoded']))
						.then((res) => {
							console.log("Song Name: " + res.body.name);
							console.log("Artist Name: " + res.body.artists[0].name);
							console.log("Preview: " + res.body.preview_url);
							console.log("Album Name: " + res.body.album.name);
						});
				}
			});
	},

	retrieveMovieInfo: function(movie) {
		popsicle.get("http://www.omdbapi.com/?t=" + movie + "&y=&plot=short&r=json")
			.then((res) => {
				var movieJSON = JSON.parse(res.body);
				if (!movieJSON.Title) {
					popsicle.get("http://www.omdbapi.com/?t=Mr+Nobody&y=&plot=short&r=json")
						.use(popsicle.plugins.parse(['json', 'urlencoded']))
						.then((res) => {

						});
				} else {
					console.log("* Title: " + movieJSON.Title);
					console.log("* Year: " + movieJSON.year);
					console.log("* IMDB Rating: " + movieJSON.imdbRating);
					console.log("* Country: " + movieJSON.Country);
					console.log("* Language: " + movieJSON.Language);
					console.log("* Plot: " + movieJSON.Plot);
					console.log("* Actors: " + movieJSON.Actors);
					console.log("* RottenTomatoes Rating: " + movieJSON.Ratings[1].Value);
					console.log("* Rotten Tomatoes URL: https://www.rottentomatoes.com/m/" + movieJSON.Title.toLowerCase().replace(/\ /g, "_").replace(/\./g, ""));
				}
			});
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