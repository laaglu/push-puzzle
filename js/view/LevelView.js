define(['view/ViewBase', 'view/templates/LevelTemplate'],
  function(ViewBase, LevelTemplate) {

    "use strict";

    return ViewBase.extend({
      tagName: 'li',
      template: LevelTemplate,
      initialize: function () {
        this.listenTo(this.model, 'change:name', this.render);
      },
      render : function() {
        var data = this.model.toJSON();
        data.name = this.model.name();
        data.creationDate = this.model.creationDate();
        this.$el.html(this.template(data));
        return this;
      }
    });
  }
);

