# Mixmax Trello

This is a set of integrations for Mixmax, which ads two things:

* An enhancement which allows you to authorize the server to search trello for you.
* A slash command that queries your tasks and embeds them into your emails.

### Developing

    npm i
    npm start

Start google chrome with insecure flags to test locally.

Add an enhancement via the mixmax dashboard that points the editor url to `http://localhost:9145/authorize`, the activate and resolver urls do not matter.

Add a slash command with the suggestions to `http://localhost:9145/typeahead` and the resolver to `http://localhost:9145/resolver`

### Using

To just use the running production server, add an enhancement in the Mixmax dashboard with the editor pointing at `https://sheltered-shelf-74819.herokuapp.com/authorize`
and a slash command with the suggestions url as `https://sheltered-shelf-74819.herokuapp.com/typeahead` and the resolver url as `https://sheltered-shelf-74819.herokuapp.com/resolver`.
