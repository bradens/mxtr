var express = require('express'),
    bodyParser = require('body-parser'),
    app = express(),
    OAuth = require('oauth').OAuth,
    constants = require('./constants'),
    _ = require('lodash'),
    cors = require('cors');

// Load app keys and sensitive info from here
var PUBLIC_KEY = process.env.PUBLIC_KEY || require("./secrets").PUBLIC_KEY,
    SECRET = process.env.SECRET || require("./secrets").SECRET;

var requestURL = constants.requestURL,
    accessURL = constants.accessURL,
    authorizeURL = constants.authorizeURL,
    hostname = constants.hostname,
    appName = constants.appName;

var oauth = new OAuth(requestURL, accessURL, PUBLIC_KEY, SECRET, "2.0", hostname + '/done_authorization', "HMAC-SHA1");

var corsOptions = {
  origin: /^[^.\s]+\.mixmax\.com$/,
  credentials: true
};

// Store the oauth tokens somewhere, move to a persistent store eventually
var oauth_store = {};
var oauth_tokens = {};
var oauth_access_tokens = {};

app.get('/authorize', function(req, res) {
  oauth.getOAuthRequestToken(function(error, token, tokenSecret, results) {
    oauth_store[token] = { tokenSecret: tokenSecret, email: req.query.user };
    res.writeHead(302, { 'Location': authorizeURL + "?oauth_token=" + token + "&name=" + appName })
    res.end()
  });
});

app.get('/done_authorization', function(req, res) {
  var token = req.query.oauth_token;
  var tokenSecret = oauth_store[token].tokenSecret;
  var verifier = req.query.oauth_verifier;
  oauth.getOAuthAccessToken(token, tokenSecret, verifier, function(error, accessToken, accessTokenSecret, results) {
    // Save the access tokens
    oauth_store[token] = _.extend(oauth_store[token], {
      accessToken: accessToken,
      accessTokenSecret: accessTokenSecret
    });

    // Close the window.
    res.end("<script>window.close()</script>");
  });
});

app.get('/typeahead', cors(corsOptions), _.partial(require('./api/typeahead'), _, _, oauth, oauth_store));
app.get('/resolver', cors(corsOptions), _.partial(require('./api/resolver'), _, _, oauth, oauth_store));

app.listen(process.env.PORT || 9145);
