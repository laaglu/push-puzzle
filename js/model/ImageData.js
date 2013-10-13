define(["backbone", "model/db"],
  function(Backbone, database) {

    "use strict";

    /*
     data : (string) The image data URL,
     */
    return Backbone.Model.extend({
      database: database,
      storeName: 'image'
    });
  }
);