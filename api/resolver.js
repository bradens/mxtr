var fs = require('fs'),
    path = require('path'),
    trelloCardPath = require('../constants').trelloCardPath,
    _ = require('lodash'),
    handlebars = require('handlebars');

// Load the handlebars template for the trello card that we'll use later
var source = fs.readFileSync('card.tpl', 'utf-8');
var cardTemplate = handlebars.compile(source);

module.exports = function(req, res, oauth, oauthStore) {
  var term = req.query.text.trim();

  // Use the mixmax-provided email as the key in our token store
  var email = req.query.user;
  var oauthCredentials = _.find(oauthStore, { email: email });

  if (/^https:\/\/trello\.com\/c\/\S+/.test(term)) {
    // Just unfurl and write the template
    handleIdString(term.replace(/^https:\/\/trello\.com\/c\//, ''), req, res, email, oauthCredentials, oauth);
  } else {
    // We need to first do the search, select the top one, then render the template
    handleSearchString(term, req, res, email, oauthCredentials, oauth);
  }
};

// Resolve an Id
function handleIdString(id, req, res, email, oauthCredentials, oauth) {
  if (!oauthCredentials) {
    res.status(500).send("Error, couldn't find credentials, have you authorized with the server yet?");
    return;
  }

  try {
    oauth.getProtectedResource(
      trelloCardPath + '/' + id,
      "GET",
      oauthCredentials.accessToken,
      oauthCredentials.accessTokenSecret,
      function(error, data, response) {
        var card = JSON.parse(data);
        var html = cardTemplate(card);
        res.json({
          body: html
        });
      }
    );
  }
  catch (e) {
    res.status(500).end("Error");
    return;
  }
}

// Resolve a query
function handleSearchString(term, req, res, email, oauthCredentials, oauth) {
  // First get the search
  oauth.getProtectedResource(
    trelloSearchPath + "?partial=true&query=" + term,
    "GET",
    oauthCredentials.accessToken,
    oauthCredentials.accessTokenSecret,
    function(error, data, response) {

      var cards = JSON.parse(data).cards
      if (cards.length) {
        // If we have a card, then run the id string on that card.
        handleIdString(cards[0].id, req, res, email, oauthCredentials, oauth);
      } else {
        res.status(404).send("Error");
        return;
      }
    }
  );
}
