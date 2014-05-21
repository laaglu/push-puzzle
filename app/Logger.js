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

/*global localStorage*/
var SHOW_LOGS = 'showLogs';
var showLogs = localStorage.getItem(SHOW_LOGS);
var logger = {
  getShowLogs : function() {
    return showLogs === 'true';
  },
  setShowLogs : function(value) {
    localStorage.setItem(SHOW_LOGS, value);
    showLogs = value;
  },
  log: function() {
    if (showLogs === 'true') {
      console.log.apply(console, arguments);
    }
  },
  error: function() {
    if (showLogs === 'true') {
      console.error.apply(console, arguments);
    }
  }
};
// If the setting has not been set explicitely, it is off by default.
if (showLogs === null) {
  logger.setShowLogs('false');
}
module.exports = logger;
