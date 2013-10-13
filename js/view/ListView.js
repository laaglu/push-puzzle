define(['view/ViewBase', 'model/Levels', 'view/templates/ListTemplate', 'view/LevelView', 'Logger'],
  function(ViewBase, levels, ListTemplate, LevelView, logger) {

    "use strict";

    return ViewBase.extend({
      el: '#listView',
      template: ListTemplate,
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
          item[0].style['height'] = 0;
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
      }
    });
  }
);

