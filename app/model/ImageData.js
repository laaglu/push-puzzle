'use strict';

var database = require('./db');
/*
 data : (string) The image data URL,
 */
module.exports = Backbone.Model.extend({
  database: database,
  storeName: 'image'
});
