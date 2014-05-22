/**********************************************
 * Copyright (C) 2014 Lukas Laag
 * This file is part of push-puzzle.
 * 
 * push-puzzle is free software: you can redistribute it and/or modify
 * it under the terms of the GNU General Public License as published by
 * the Free Software Foundation, either version 3 of the License, or
 * (at your option) any later version.
 * 
 * push-puzzle is distributed in the hope that it will be useful,
 * but WITHOUT ANY WARRANTY; without even the implied warranty of
 * MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE.  See the
 * GNU General Public License for more details.
 * 
 * You should have received a copy of the GNU General Public License
 * along with push-puzzle.  If not, see http://www.gnu.org/licenses/
 **********************************************/
'use strict';

/* global Backbone, $, location, document */
var install = require('model/Installation');
var levels = require('model/Levels');
var GameView = require('view/GameView');
var ListView = require('view/ListView');
var EditView = require('view/EditView');
var DifficultyView = require('view/DifficultyView');
var ViewBase = require('view/ViewBase');
var LazyView = require('view/LazyView');
var AboutView = require('view/AboutView');
var SettingsView = require('view/SettingsView');
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
    'settings':                   'settings',
    'legal':                      'legal',
    'translations':               'translations',
    'install':                    'install',
    'update':                     'update',
    'releaseNotes':               'releaseNotes',
    'gpl':                        'gpl'
  },

  initialize : function initialize() {
    var router = this;
    levels.fetchAll({success: function() {
      $('#loadingView').addClass('hidden');
      router.levelIndex = levels.getCurrentLevel();
      router.gameView = new GameView();
      router.listView = new ListView().render();
      router.editView = new EditView();
      router.difficultyView = new DifficultyView();
      router.aboutView = new AboutView();
      router.settingsView = new SettingsView();
      router.legalView = new ViewBase({el : $('#legalView')[0], 
        events: { 'click #repo' : 'openUrl' }});
      router.releaseNotesView = new LazyView({el : $('#releaseNotesView')[0], path:'/data/releaseNotes.html'});
      router.translationsView = new LazyView({el : $('#translationsView')[0], path:'/data/translations.html'});
      router.gplView = new LazyView({el : $('#gplView')[0], path:'/data/gpl-3.0-standalone.html'});
      router.gameView.bind(levels.at(router.levelIndex));

      install.check({
        onerror: function onerror(e) {
          logger.error(e);
        }
      });
    }});
  },

  play: function play(levelid) {
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

  menu: function menu() {
    logger.log('menu');
    this.gameView.deactivate(true);
    this.listView.deactivate();
    this.aboutView.deactivate();
    this.settingsView.deactivate();
  },

  list: function list() {
    logger.log('list');
    this.listView.activate();
    if (this.editView.isActive()) {
      this.editView.model = null;
      this.editView.deactivate();
    }
  },

  edit: function edit(levelid) {
    logger.log('edit', levelid);
    var editView = this.editView;
    var level = levels.get(levelid);
    if (level) {
      editView.bind(level);
      editView.activate();
      if (this.difficultyView.isActive()) {
        this.difficultyView.deactivate();
      }
    }
  },

  difficulty: function difficulty(levelid) {
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

  commit: function commit() {
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

  erase: function erase(levelid) {
    logger.log('delete', levelid);
    var level = levels.get(levelid);
    if (level) {
      level.terminate();
      location.hash = '#/list';
    }
  },

  create : function create() {
    logger.log('create', levels);
    levels.createLevel();
    location.hash = '#/list';
  },

  shuffle: function shuffle() {
    logger.log('shuffle');
    this.gameView.model.set({state: null});
    this.gameView.model = null;
    location.hash = '#/play/' + levels.at(this.levelIndex).id;
  },

  next: function next() {
    logger.log('next');
    this.levelIndex++;
    if (this.levelIndex >= levels.length) {
      this.levelIndex = 0;
    }
    location.hash = '#/play/' + levels.at(this.levelIndex).id;
  },

  previous: function previous() {
    logger.log('previous');
    this.levelIndex--;
    if (this.levelIndex < 0) {
      this.levelIndex = levels.length - 1;
    }
    location.hash = '#/play/' + levels.at(this.levelIndex).id;
  },

  factoryReset: function factoryReset() {
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

  about: function about() {
    logger.log('about');
    this.aboutView.activate();
    this.legalView.deactivate();
    this.translationsView.deactivate();
    this.releaseNotesView.deactivate();
  },

  settings: function settings() {
    logger.log('settings');
    this.settingsView.activate();
  },

  legal: function legal() {
    logger.log('legal');
    this.legalView.activate();
    this.gplView.deactivate();
  },

  install : function install() {
    logger.log('install');
    install.install();
    location.hash = '#/about';
  },

  update : function update() {
    logger.log('update');
    // Only FFOS supports update (in non-packaged hosted mode)
    // This occurs when manifest installed in the device
    // has older version than manifest updated by the appcache
    // a new mozApp.install is required (so that user can re-approve manifest.webapp)
    install.install();
    location.hash = '#/about';
  },

  releaseNotes : function releaseNotes() {
    logger.log('releaseNotes');
    this.releaseNotesView.render();
    this.releaseNotesView.activate();
  },

  translations : function translations() {
    logger.log('translations');
    this.translationsView.render();
    this.translationsView.activate();
  },

  gpl: function gpl() {
    logger.log('gpl');
    this.gplView.render();
    this.gplView.activate();
  },

  easter1 : function easter1() {
    logger.log('easter1');
    if (!this.easter) {
      this.easter = 'easter';
      if (!this.easterCount) {
        this.easterCount = 0;
      }
    }
    location.hash = '#/menu';
  },

  easter2 : function easter2() {
    logger.log('easter2');
    if (this.easter) {
      this.easterCount++;
      if (this.easterCount === 3) {
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

