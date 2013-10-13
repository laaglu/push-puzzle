define(['view/ViewBase', 'view/templates/DifficultyTemplate'],
  function(ViewBase, DifficultyTemplate) {

    "use strict";

    return ViewBase.extend({
      el: '#difficultyView',
      template: DifficultyTemplate,
      events: {
        'click li': 'update'
      },
      render : function() {
        var difficulty = this.model.get('difficulty');
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
        this.model.attributes['difficulty'] = li.index();
      }
    });
  }
);

