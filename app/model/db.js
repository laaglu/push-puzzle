/**********************************************
 * Copyright (C) 2014 Lukas Laag
 * This file is part of push-puzzle.
 * 
 * push-puzzle is free software: you can redistribute it and/or modify
 * it under the terms of the GNU General Public License as published by
 * the Free Software Foundation, either version 3 of the License, or
 * (at your option) any later version.
 * 
 * push-puzzle is distributed in the hope that it will be useful,
 * but WITHOUT ANY WARRANTY; without even the implied warranty of
 * MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE.  See the
 * GNU General Public License for more details.
 * 
 * You should have received a copy of the GNU General Public License
 * along with push-puzzle.  If not, see http://www.gnu.org/licenses/
 **********************************************/
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
