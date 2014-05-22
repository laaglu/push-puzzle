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

var Modernizr = require('modernizr');
var logger = require('Logger');

/* global Backbone, window, MozActivity */
module.exports = Backbone.View.extend({
  inactive: 'inactive',
  /**
   * Replaces the contents of $el with the contents of another element
   * @param element
   */
  replaceContent : function(element) {
    this.$el.children().remove();
    this.$el.append(element.children());
  },
  defer: function(f) {
    setTimeout(f.bind(this), 50);
  },
  deferTransition: function(f, el) {
    (el ? el : this.$el).one('transitionend', f.bind(this));
  },
  activate : function() {
    if (!this.isActive()) {
      this.$el.removeClass('hidden');
      this.defer(function() {
        this.$el.removeClass(this.inactive);
      });
    }
  },
  deactivate : function(nohide) {
    if (this.isActive()) {
      if (!nohide) {
        this.deferTransition(function() {
          this.$el.addClass('hidden');
        });
      }
      this.$el.addClass(this.inactive);
    }
  },
  isActive: function() {
    return !this.$el.hasClass(this.inactive);
  },
  openUrl : function openUrl(evt) {
    var target, activity, href, windowName;
    
    logger.log('openUrl', evt);
    target = evt.target;
    href = target.dataset.href;
    windowName = target.id;
    if (Modernizr.webactivities) {
      activity = new MozActivity({
        // Ask for the "pick" activity
        name: "view",

        // Provide the data required by the filters of the activity
        data: {
          type: "url",
          url : href
        }
      });

      activity.onerror = function onerror() {
        logger.error(this.error);
      };

    } else {
      window.open(href, windowName);
    }
  }
});
