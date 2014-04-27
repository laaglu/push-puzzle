'use strict';

var database = require('./db');
var ImageData = require('./ImageData');
var logger = require('Logger');

/*
 name : (string) The level name,
 l10n : (string) The level l10n key (the corresponding property value takes precedence over name if it exists)
 difficulty: (number) The level difficulty (0: easy, 1: medium,  2: hard)
 type : (string) Image type: vector or bitmap,
 path: (string) The data path for built-in images
 imageId: (string) The image PK for custom images
 miniature : (string) The level icon png/jpg/gif,
 creationDate: (number) The level creation date (in ms since epoch)
 lastPlayed : (number) The play date (in ms since epoch, -1 if never played)
 state: (string) The current tile state
 */
var Level = Backbone.Model.extend({
  database: database,
  storeName: 'level',
  defaults : {
    // Set creation date to now
    creationDate : Date.now()
  },
  initialize: function() {
  },
  name : function() {
    var l10n, name;
    name = this.get('name');
    if (!name) {
      l10n = this.get('l10n');
      if (l10n) {
        name = document.webL10n.get(l10n);
      }
    }
    return name;
  },
  creationDate : function() {
    return moment(+this.get('creationDate')).format('lll');
  },
  lastPlayed : function() {
    var lastPlayed = this.get('lastPlayed');
    return lastPlayed ? moment(+lastPlayed).format('lll') : null;
  },
  isVector : function() {
    return this.get('type') === Level.VECTOR;
  },
  difficultyKey: function(index) {
    var difficulties = ['easy', 'medium', 'hard'];
    return difficulties[index !== undefined ? index : this.get('difficulty')];
  },
  difficultyValue: function(index) {
    var difficulties = ['easy', 'medium', 'hard'];
    return document.webL10n.get(this.difficultyKey(index));
  },
  // Reads the ImageData instance associated with this level, if it exists
  // @param options {Object} a hash containing two functions, success(model,response,option)
  // called with the resulting svg image in case of success, error called with the error in case
  // of error
  readUserImage: function(options) {
    if (options.success) {
      if (this.imageData) {
          options.success(this.imageData);
      }
      var imageId = this.get('imageId');
      if (imageId) {
        this.imageData = new ImageData({id: imageId});
        this.imageData.fetch(options);
      } else {
        options.success(null);
      }
    }
  },
  // Reads the level image
  // @param options {Object} a hash containing two functions, success, called with the
  // resulting svg image in case of success, error called with the error in case
  // of error
  readImage : function(options) {
    var level = this;

    // Internal function to handle errors
    var onerror = function onerror(e) {
      logger.error(e);
      if (options.error) {
        options.error(e);
      }
    };

    // Internal function to read built-in bitmap images
    var readBuiltInBitmap = function(path) {
      // Load the image as XMLHttpRequest+blob
      var req = new XMLHttpRequest();
      req.open("GET", path, true);
      req.responseType = "blob";
      req.onload = function() {
        wrapInSvg(URL.createObjectURL(req.response));
      };
      req.onerror = onerror;
      req.send();
    };

    // Internal function to read built-in vector images
    var readBuiltInVector = function(path) {
      var request = new XMLHttpRequest();
      request.onload = function() {
        try {
          var parser = new DOMParser();
          var svg = parser.parseFromString(this.responseText, "text/xml").documentElement;
          if ("parsererror" == svg.localName) {
            onerror(new Error("Parsing error:" + svg.innerText));
          }
          if (options.success) {
            options.success(svg);
          }
        } catch (e) {
          onerror(e);
        }
      };
      request.onerror = onerror;
      request.open("GET", path, true);
      request.send();
    };

    // Internal function to load an image and wrap it in an SVG element
    var wrapInSvg = function(url) {
      var img = document.createElement("img");
      img.onload = function onload() {
        var svgImg, svg;
        svg = document.createSVGSVGElement();
        svg.setViewBox1(0, 0, img.width, img.height);
        svgImg = document.createSVGImageElement();
        svgImg.href.baseVal = url;
        svgImg.width.baseVal.value = img.width;
        svgImg.height.baseVal.value = img.height;
        svg.appendChild(svgImg);
        if (options.success) {
          options.success(svg);
        }
      };
      img.onerror = onerror;
      img.src = url;
    };

    // ---> Actual code starts here <---
    var path = this.get('path');
    if (path) {
      if (level.isVector()) {
        readBuiltInVector(path);
      } else {
        readBuiltInBitmap(path);
      }
    } else {
      level.readUserImage({
        success: function success(model, response, options) {
          var data = model.get('data');
          var type = model.get('type');
          if (data.constructor === ArrayBuffer) {
            var blob = new Blob([data], {type: type});
            wrapInSvg(URL.createObjectURL(blob));
            /*var fileReader = new FileReader();
            fileReader.onload = function() {
              wrapInSvg(fileReader.result);
            };
            fileReader.onerror = onerror;
            fileReader.readAsDataURL(blob);*/
          } else {
            wrapInSvg(data);
          }
        },
        error:onerror
      });
    }
  },
  terminate : function() {
    var model = this;
    this.readUserImage({
      success: function(imageData) {
        if (imageData) {
          imageData.destroy();
        }
        model.destroy();
      }
    });
  },
  update: function() {
    this.set({state: this.get('state'), lastPlayed: Date.now()});
    this.save();
  }
});
Level.VECTOR = "vector";
Level.BITMAP = "bitmap";

module.exports = Level;
