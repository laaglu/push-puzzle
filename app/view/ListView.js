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

/* global document, location, $*/

var ViewBase = require('./ViewBase');
var levels = require('model/Levels');
var ListTemplate = require('./templates/ListTemplate');
var LevelView = require('./LevelView');
var logger = require('Logger');

module.exports = ViewBase.extend({
  el: '#listView',
  template: ListTemplate,
  events: {
    'click #createBtn': 'createLevel'
  },
  initialize: function () {
    this.collection = levels;
    this.listenTo(this.collection, 'add', function(level) {
      // Cannot call addLevel directly because the add notification
      // has a (model, collection, options) signature
      this.addLevel(level);
    });
    this.listenTo(this.collection, 'remove', this.removeLevel);
    this.listenTo(this.collection, 'reset', this.reset);
  },

  /**
   * @param level
   * @param skipTransition
   * skip the transition animation: true when
   * the method is invoked as a subroutine by render,
   * false when it is invoked on backbone 'add' event.
   */
  addLevel: function (level, skipTransition) {
    logger.log('ListView.addLevel', level);
    var attributes = { 'data-id': level.id};
    if (skipTransition !== true) {
      attributes.style = 'height:0;';
    }
    var levelView = new LevelView({model: level, attributes: attributes}).render();
    this.$('ul').prepend(levelView.$el);
    if (skipTransition !== true) {
      this.defer(function() {
        levelView.$el.attr('style', null);
      });
    }
  },

  removeLevel: function (level) {
    logger.log('ListView.removeLevel', level, this);
    var sel = 'li[data-id="' + level.id + '"]';
    var item = this.$(sel);
    //logger.log("sel", sel);
    //logger.log("Length", item.length);
    if (item.length) {
      this.deferTransition(function() {
        item.remove();
      }, item);
      item[0].style.height = 0;
    }
  },

  reset: function(/*collection, options*/) {
    logger.log('ListView.reset');
    this.$('ul').empty();
  },

  render: function () {
    logger.log('ListView.render');

    var tpl = $(this.template());
    document.webL10n.translate(tpl[0]);
    this.replaceContent(tpl);

    var i;
    for (i = this.collection.length - 1; i >= 0; i--) {
      this.addLevel(this.collection.at(i), true);
    }
    return this;
  },

  createLevel: function () {
    logger.log('ListView.createLevel');
    levels.createLevel();
    location.hash = '#/list';
  }
});
