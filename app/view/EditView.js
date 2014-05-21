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

/* global document, $*/

var ViewBase = require('./ViewBase');
var EditTemplate = require('./templates/EditTemplate');
var Level = require('model/Level');

module.exports = ViewBase.extend({
  el: '#editView',
  template: EditTemplate,
  events: {
    'change input[data-l10n-id="name"]': 'update'
  },
  bind: function(level) {
    if (!this.model || this.model.id !== level.id) {
      // Work on a snapshot of model, not the model itself
      this.model = new Level(level.attributes);
      this.svg = null;
    }
    this.render();
  },
  render : function() {
    if (!this.svg) {
      var view = this;
      this.model.readImage({
        success: function(svg) {
          this.svg = svg;
          view.$('svg').replaceWith($(this.svg));
        }
      });
    }
    var data = {
      id: this.model.id,
      name: this.model.name(),
      difficulty: this.model.get('difficulty'),
      difficultyValue: this.model.difficultyValue(),
      creationDate : this.model.creationDate(),
      lastPlayed: this.model.lastPlayed()
    };
    var tpl = $(this.template(data));
    document.webL10n.translate(tpl[0]);
    if (this.svg) {
      $('svg', tpl).replaceWith($(this.svg));
    }
    this.replaceContent(tpl);
    return this;
  },
  update : function(e) {
    this.model.attributes.name = e.target.value;
  }
});

