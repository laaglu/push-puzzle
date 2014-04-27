'use strict';

var logger = require('Logger');

module.exports =  {
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
