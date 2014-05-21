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
var DifficultyTemplate = require('./templates/DifficultyTemplate');

module.exports = ViewBase.extend({
  el: '#difficultyView',
  template: DifficultyTemplate,
  events: {
    'click li': 'update'
  },
  render : function() {
    var data = {
      id: this.model.id
    };
    data[this.model.difficultyKey()] = true;
    var tpl = $(this.template(data));
    document.webL10n.translate(tpl[0]);
    this.replaceContent(tpl);
    return this;
  },
  update: function(e) {
    this.$('li').removeAttr('aria-checked');
    var li = $(e.target).closest('li');
    li.attr('aria-checked', 'true');
    // Working on the snapshot, do not trigger change events
    this.model.attributes.difficulty = li.index();
  }
});

