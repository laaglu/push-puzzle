define(['view/ViewBase', 'view/templates/EditTemplate', 'model/Level'],
  function(ViewBase, EditTemplate, Level) {

    "use strict";

    return ViewBase.extend({
      el: '#editView',
      template: EditTemplate,
      events: {
        'change input[data-l10n-id="name"]': 'update'
      },
      bind: function(level) {
        if (!this.model || this.model.id !== level.id) {
          var view = this;
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
  }
);

