define(['backbone'],
  function(Backbone) {

    "use strict";

    return Backbone.View.extend({
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
        return !this.$el.hasClass(this.inactive)
      }
    });
  }
);