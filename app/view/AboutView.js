'use strict';

var ViewBase = require('./ViewBase');
var AboutTemplate = require('./templates/AboutTemplate');
var install = require('model/Installation');
var logger = require('Logger');

module.exports = ViewBase.extend({
  el: '#aboutView',
  template: AboutTemplate,
  model: install,
  events: {
    'click a[data-l10n-id="installBtn"]' : 'showNotification',
    'change input[type="checkbox"]' : 'toggleDebug'
  },

  initialize: function () {
    this.listenTo(this.model, 'change', this.render);
    this.render();
  },

  render : function() {
    logger.log('AboutView.render()');
    var resourceVersion = this.model.get('resourceVersion');
    var manifestVersion = this.model.get('manifestVersion');
    var install = this.model.get('state') == 'uninstalled';
    var update = this.model.get('state') == 'installed'
     && manifestVersion != null
     && manifestVersion != resourceVersion;
    var data = {
      version: manifestVersion ?  manifestVersion : resourceVersion,
      updateVersion: resourceVersion,
      install: install,
      update: update,
      error: this.model.get('error'),
      debugLogs: logger.getShowLogs()
    }
    var tpl = $(this.template(data));
    document.webL10n.translate(tpl[0]);
    this.replaceContent(tpl);
    this.delegateEvents();
    return this;
  },

  showNotification: function() {
    logger.log('AboutView.showNotification()');
    if (this.model.get('type') == 'ios') {
      var msg = this.$('#arrow_box');
      msg.show();

      setTimeout(function() {
        msg.hide();
      }, 8000);
    }
  },

  toggleDebug : function() {
    logger.log('toggleDebug()');
    logger.setShowLogs('' + (!logger.getShowLogs()));
  }
});

