'use strict';

var install = require('model/Installation');
var Level = require('model/Level');
var levels = require('model/Levels');
var GameView = require('view/GameView');
var ListView = require('view/ListView');
var EditView = require('view/EditView');
var DifficultyView = require('view/DifficultyView');
var ViewBase = require('view/ViewBase');
var LazyView = require('view/LazyView');
var AboutView = require('view/AboutView');
var logger = require('Logger');

module.exports = Backbone.Router.extend({
  routes: {
    'play/:levelid':              'play',
    'menu':                       'menu',
    'list':                       'list',
    'edit/:levelid':              'edit',
    'difficulty':                 'difficulty',
    'commit':                     'commit',
    'erase/:levelid':             'erase',
    'create':                     'create',
    'shuffle':                    'shuffle',
    'next':                       'next',
    'previous':                   'previous',
    'factoryReset':               'factoryReset',
    'easter1':                    'easter1',
    'easter2':                    'easter2',
    'about':                      'about',
    'legal':                      'legal',
    'install':                    'install',
    'update':                     'update',
    'releaseNotes':               'releaseNotes',
    'gpl':                        'gpl',
    'source':                     'source'
  },

  initialize : function() {
    var router = this;
    levels.fetchAll({success: function() {
      $('#loadingView').addClass('hidden');
      router.levelIndex = levels.getCurrentLevel();
      router.gameView = new GameView();
      router.listView = new ListView().render();
      router.editView = new EditView();
      router.difficultyView = new DifficultyView();
      router.aboutView = new AboutView();
      router.legalView = new ViewBase({el : $('#legalView')[0]});
      router.releaseNotesView = new LazyView({el : $('#releaseNotesView')[0], path:'/data/releaseNotes.html'});
      router.gplView = new LazyView({el : $('#gplView')[0], path:'/data/gpl-3.0-standalone.html'});
      router.sourceView = new LazyView({el : $('#sourceView')[0], path:'/data/source.html'});
      router.gameView.bind(levels.at(router.levelIndex));

      install.check({
        onerror: function onerror(e) {
          logger.error(e);
        }
      });
    }});
  },

  play: function(levelid) {
    logger.log('play', levelid);
    var level = levels.get(levelid);
    if (level) {
      this.levelIndex = levels.indexOf(level);
      levels.setCurrentLevel(this.levelIndex);
      this.gameView.bind(level);

      if (this.listView.isActive()) {
        // If the transition is triggered from the list view, make the game view
        // appear from the right of the list view, instead of its usual position
        // (half-obscured by the menu view)
        var router = this;
        this.gameView.$el.attr('class', 'inactive top'); // Remove view class to deactivate CSS transitions, put the gameview on top of the list view
        this.gameView.defer(function() {
          router.gameView.$el.addClass('view');  // Re-enable CSS transitions
          router.gameView.defer(function() {
            router.gameView.deferTransition(function() {
              router.gameView.$el.removeClass('top'); // Restore proper z-indices.
              router.listView.$el.attr('class', 'view inactive hidden');  // Hide the list
            });
            router.gameView.$el.removeClass('inactive'); // Show the level

          });
        });
      } else {
        this.gameView.activate();
      }
    }
  },

  menu: function() {
    logger.log('menu');
    this.gameView.deactivate(true);
    this.listView.deactivate();
    this.aboutView.deactivate();
  },

  list: function() {
    logger.log('list');
    this.listView.activate();
    if (this.editView.isActive()) {
      this.editView.model = null;
      this.editView.deactivate();
    }
  },

  edit: function(levelid) {
    logger.log('edit', levelid);
    var editView = this.editView;
    var level = levels.get(levelid);
    if (level) {
      this.editView.bind(level);
      this.editView.activate();
      if (this.difficultyView.isActive()) {
        this.difficultyView.deactivate();
      }
    }
  },

  difficulty: function(levelid) {
    logger.log('difficulty', levelid);
    var level;
    if (!levelid) {
      level = this.editView.model;
    } else {
      level = levels.get(levelid);
    }
    if (level) {
      this.difficultyView.model = level;
      this.difficultyView.render();
      this.difficultyView.activate();
    }
  },

  commit: function() {
    logger.log('commit');
    var snapshot = this.editView.model;
    if (snapshot) {
      var level = levels.get(snapshot.id);
      if (level) {
        level.set(snapshot.attributes);
        level.save();
      }
    }
    location.hash = '#/list';
  },

  erase: function(levelid) {
    logger.log('delete', levelid);
    var level = levels.get(levelid);
    if (level) {
      level.terminate();
      location.hash = '#/list';
    }
  },

  create : function() {
    logger.log('create', levels);
    levels.createLevel();
    location.hash = '#/list';
  },

  shuffle: function() {
    logger.log('shuffle');
    this.gameView.model.set({state: null});
    this.gameView.model = null;
    location.hash = '#/play/' + levels.at(this.levelIndex).id;
  },

  next: function() {
    logger.log('next');
    this.levelIndex++;
    if (this.levelIndex >= levels.length) {
      this.levelIndex = 0;
    }
    location.hash = '#/play/' + levels.at(this.levelIndex).id;
  },

  previous: function() {
    logger.log('previous');
    this.levelIndex--;
    if (this.levelIndex < 0) {
      this.levelIndex = levels.length - 1;
    }
    location.hash = '#/play/' + levels.at(this.levelIndex).id;
  },

  factoryReset: function() {
    logger.log('factoryReset');
    if (confirm(document.webL10n.get('factorySettings'))) {
      var router = this;
      levels.resetAll({
        success: function() {
          router.levelIndex = levels.getCurrentLevel();
          location.hash = '#/play/' + levels.at(router.levelIndex).id;
        }
      });
    } else {
      location.hash = '#/menu';
    }
  },

  about: function() {
    logger.log('about');
    this.aboutView.activate();
    this.legalView.deactivate();
    this.releaseNotesView.deactivate();
  },

  legal: function() {
    logger.log('legal');
    this.legalView.activate();
    this.gplView.deactivate();
    this.sourceView.deactivate();
  },

  install : function() {
    logger.log('install');
    install.install();
    location.hash = '#/about';
  },

  update : function() {
    logger.log('update');
    // Only FFOS supports update (in non-packaged hosted mode)
    // This occurs when manifest installed in the device
    // has older version than manifest updated by the appcache
    // a new mozApp.install is required (so that user can re-approve manifest.webapp)
    install.install();
    location.hash = '#/about';
  },

  releaseNotes : function() {
    logger.log('releaseNotes');
    this.releaseNotesView.render();
    this.releaseNotesView.activate();
  },

  gpl: function() {
    logger.log('gpl');
    this.gplView.render();
    this.gplView.activate();
  },

  source: function() {
    logger.log('source');
    this.sourceView.render();
    this.sourceView.activate();
  },

  easter1 : function() {
    logger.log('easter1');
    if (!this.easter) {
      this.easter = 'easter';
      if (!this.easterCount) {
        this.easterCount = 0;
      }
    }
    location.hash = '#/menu';
  },

  easter2 : function() {
    logger.log('easter2');
    if (this.easter) {
      this.easterCount++;
      if (this.easterCount == 3) {
        delete this.easterCount;
        delete this.easter;
        this.gameView.createState();
        this.gameView.model.update();
        location.hash = '#/play/' + levels.at(this.levelIndex).id;
        return;
      }
      delete this.easter;
    }
    location.hash = '#/menu';
  }
});

