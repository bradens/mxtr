module.exports = {
  requestURL: "https://trello.com/1/OAuthGetRequestToken",
  accessURL: "https://trello.com/1/OAuthGetAccessToken",
  authorizeURL: "https://trello.com/1/OAuthAuthorizeToken",
  appName: "MixmaxTrello",
  hostname: process.env.NODE_ENV === "production" ? 'https://sheltered-shelf-74819.herokuapp.com' : 'http://localhost:9145',
  trelloSearchPath: 'https://api.trello.com/1/search',
  trelloCardPath: 'https://api.trello.com/1/cards'
};
