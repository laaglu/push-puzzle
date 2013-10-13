define(['backbone', 'vendor/backbone-indexeddb', 'Logger'], function (Backbone, idxdb, logger) {

  "use strict";

  Backbone.sync = idxdb.sync;

  return {
    id: 'pushdb',
    migrations: [{
      version: 1,
      migrate: function (transaction, next) {
        logger.log("indexedDB.migrate", transaction);
        var levelStore = transaction.db.createObjectStore('level');
        var imageStore = transaction.db.createObjectStore('image');
        next();
      }
    }]
  };
});