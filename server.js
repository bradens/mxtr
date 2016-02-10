var express = require('express'),
    bodyParser = require('body-parser'),
    app = express(),
    sync = require('synchronize'),
    cors = require('cors');

// Load app keys and sensitive info from here
var PUBLIC_KEY = require("./secrets").PUBLIC_KEY

var corsOptions = {
  origin: /^[^.\s]+\.mixmax\.com$/,
  credentials: true
};

app.get('/authorize', function(req, res) {
  res.redirect("https://trello.com/1/connect?key=" + PUBLIC_KEY + "&name=MixmaxTrello&response_type=token&expiration=never");
});
app.get('/typeahead', cors(corsOptions), require('./api/typeahead'));
app.get('/resolver', cors(corsOptions), require('./api/resolver'));

app.listen(process.env.PORT || 9145);
