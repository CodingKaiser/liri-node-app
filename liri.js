var keys = require("./keys.js");
var https = require("https");
var OAuth = require('oauth');

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

process.argv.forEach(function (val, index, array) {
	console.log(index + ': ' + val);
});