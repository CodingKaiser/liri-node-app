var keys = require("./keys.js");
const OAuth = require('oauth');
const popsicle = require('popsicle');
const fs = require('fs');

var app = {
	defaultSongId: "0hrBpAOgrt8RXigk83LLNE",
	defaultMovie: "Mr. Nobody",

	parseStdIn: function(argArray) {
		var userCommand = argArray[2].toLowerCase();
		if (userCommand === "my-tweets") {
			this.displayTweets();
		} else if (userCommand === "spotify-this-song") {
			this.spotifySong(this._concatUserInput(argArray));
		} else if (userCommand === "movie-this") {
			this.retrieveMovieInfo(this._concatUserInput(argArray));
		} else if (userCommand === "do-what-it-says") {
			this.doWhatItSays();
		} else {
			this._tellUserTheyScrewedUp();
		}
	},

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
				if (!e) {
					JSON.parse(data).forEach(function (tweet) {
						console.log();
						console.log("Tweet: '" + tweet.text + "' was created " + tweet.created_at);
					});
				}
			}
		);
	},

	spotifySong: function(song) {
		var me = this;
		console.log("");
		popsicle.get("https://api.spotify.com/v1/search?type=track&q=" + song)
			.use(popsicle.plugins.parse(['json', 'urlencoded']))
			.then((res) => {
				if (res.body.tracks.items.length) {
					popsicle.get("https://api.spotify.com/v1/tracks/" + res.body.tracks.items[0].id)
						.use(popsicle.plugins.parse(['json', 'urlencoded']))
						.then((res) => {
							console.log("Song Name: " + res.body.name);
							console.log("Artist Name: " + res.body.artists[0].name);
							console.log("Preview: " + res.body.preview_url);
							console.log("Album Name: " + res.body.album.name);
						});
				} else {
					popsicle.get("https://api.spotify.com/v1/tracks/" + me.defaultSongId)
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
				console.log();
				if (!movieJSON.Title) {
					popsicle.get("http://www.omdbapi.com/?t=" + this.defaultMovie + "&y=&plot=short&r=json")
						.then((res) => {
							movieJSON = JSON.parse(res.body);
							this._printOutMovieData(movieJSON);
						});
				} else {
					this._printOutMovieData(movieJSON);
				}
			});
	},

	doWhatItSays: function() {
		var me = this;
		fs.readFile("random.txt", "utf-8", function(err, data) {
			if (err) console.log("Here's an error: \n" + err);
			var command = data.split(",")[0];
			var medium = "";
			if (data.split(",")[1]) {
				medium = data.split(",")[1].replace(/["']/g, "");
			}
			console.log(command + " " + medium);
			me.parseStdIn(["plchldr", "plchldr", command, medium]);
		});
	},

	_tellUserTheyScrewedUp: function() {
		console.log();
		console.log("Please enter valid command e.g.:");
		console.log("'spotify-this-song' OR 'movie-this' OR 'do-what-it-says'");
	},

	_printOutMovieData: function(movieJSON) {
		console.log("* Title: " + movieJSON.Title);
		console.log("* Year: " + movieJSON.year);
		console.log("* IMDB Rating: " + movieJSON.imdbRating);
		console.log("* Country: " + movieJSON.Country);
		console.log("* Language: " + movieJSON.Language);
		console.log("* Plot: " + movieJSON.Plot);
		console.log("* Actors: " + movieJSON.Actors);
		console.log("* RottenTomatoes Rating: " + movieJSON.Ratings[1].Value);
		console.log("* Rotten Tomatoes URL: https://www.rottentomatoes.com/m/" + 
					movieJSON.Title.toLowerCase().replace(/\ /g, "_").replace(/\./g, ""));
	},

	_concatUserInput: function(argArray) {
		var userInput = "";
		argArray.slice(3).forEach(function(elem) {
			userInput += elem + " "
		});
		if (!userInput) {
			throw "You didn't tell what to search for!";
		}
		return userInput;
	}
};

app.parseStdIn(process.argv);