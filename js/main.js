requirejs.config({
  paths: {
    jquery: 'vendor/zepto-1.0',
    underscore: 'vendor/underscore',
    backbone: 'vendor/backbone',
    moment: 'vendor/moment-langs-2.2.1.min',
    handlebars: 'vendor/handlebars'
  },
  shim: {
    'jquery': {
      exports: '$'
    },
    'handlebars': {
      exports: 'Handlebars'
    }
  }
});
require(['backbone', 'GameRouter'],
  function (backbone, GameRouter) {
    new GameRouter();
    Backbone.history.start();
  }
);
