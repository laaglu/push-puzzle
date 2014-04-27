var GameRouter = require('./GameRouter');

$(function() {
  moment.lang(navigator.language || navigator.userLanguage);
  new GameRouter();
  Backbone.history.start();
});

