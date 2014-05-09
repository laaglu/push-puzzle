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
