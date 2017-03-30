var keys = require("./keys.js");
var https = require("https");

console.log(keys.twitterKeys);

var options = {
	"accept": "*/*",
	"connection": "close",
	"method": "GET",
	"url": "https://api.twitter.com/1.1/statuses/user_timeline.json?screen_name=falkonoe&count=2",
	"headers": {
		"oauth_consumer_key": keys.twitterKeys.consumer_key,
		"oauth_nonce": Array(32+1).join((Math.random().toString(36)+'00000000000000000').slice(2, 18)).slice(0, 32);
		"oauth_signature_method": "HMAC-SHA1",
		"oauth_timestamp": (new Date().getTime() / 1000) + "",
		"oauth_token": keys.twitterKeys.access_token_key,
		"oauth_version": "1.0",
	}
}

var randomNumers = ;
console.log(randomNumers + " is " + randomNumers.length + " characters long");

https.get(options, (res) => {
  console.log('statusCode:', res.statusCode);
  console.log('headers:', res.headers);

  res.on('data', (d) => {
    process.stdout.write(d);
  });

}).on('error', (e) => {
  console.error(e);
});

process.argv.forEach(function (val, index, array) {
	console.log(index + ': ' + val);
});