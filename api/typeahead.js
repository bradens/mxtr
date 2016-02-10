var _ = require('lodash'),
    trelloSearchPath = require('../constants.js').trelloSearchPath;

module.exports = function(req, res, oauth, oauthStore) {
  var term = req.query.text.trim();
  var email = req.query.user;

  var oauthCredentials = _.find(oauthStore, { email: email });

  if (!oauthCredentials) {
    res.status(500).send("Error, couldn't find credentials, have you authorized with the server yet?");
    return;
  }

  if (!term) {
    res.json([{
      title: '<i>(enter a search term)</i>',
      text: ''
    }]);
    return;
  }

  try {
    oauth.getProtectedResource(
      trelloSearchPath + "?partial=true&query=" + term,
      "GET",
      oauthCredentials.accessToken,
      oauthCredentials.accessTokenSecret,
      function(error, data, response) {
        var cards = _.map(JSON.parse(data).cards, function(c) {
          return {
            title: '<div><b>' + c.name + '</b><br/><p>' + (c.description || '') + '</p></div>',
            text: c.shortUrl
          };
        });
        res.send(cards);
      }
    );
  }
  catch (e) {
    res.status(500).send('Error');
    return;
  }
}
