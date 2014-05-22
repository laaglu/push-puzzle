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

/* global document, $ */

var ViewBase = require('./ViewBase');
var AboutTemplate = require('./templates/AboutTemplate');
var install = require('model/Installation');
var logger = require('Logger');

module.exports = ViewBase.extend({
  el: '#aboutView',
  template: AboutTemplate,
  model: install,
  events: {
    'click #openclipart' : 'openUrl',
    'click #userguide' : 'openUrl'
  },

  initialize: function initialize() {
    this.listenTo(this.model, 'change', this.render);
    this.render();
  },

  render : function render() {
    logger.log('AboutView.render()');
    var resourceVersion = this.model.get('resourceVersion');
    var manifestVersion = this.model.get('manifestVersion');
    var tpl = $(this.template({
      version: manifestVersion ?  manifestVersion : resourceVersion
    }));
    document.webL10n.translate(tpl[0]);
    this.replaceContent(tpl);
    this.delegateEvents();
    return this;
  }

});

