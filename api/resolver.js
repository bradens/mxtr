var fs = require('fs'),
    path = require('path'),
    trelloCardPath = require('../constants').trelloCardPath,
    _ = require('lodash'),
    handlebars = require('handlebars');

var source = fs.readFileSync('card.tpl', 'utf-8');
var cardTemplate = handlebars.compile(source);

module.exports = function(req, res, oauth, oauthStore) {
  // TODO implement this resolver
  var term = req.query.text.trim();
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

function handleSearchString(term, req, res, email, oauthCredentials, oauth) {

}
