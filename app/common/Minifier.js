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

function Minifier(width, height) {
  if (width && height) {
    this.width = width;
    this.height = height;
  } else {
    // Compute a minification dimension equal
    // to 10% of the screen dimension
    var screen = window.screen;
    this.width = +screen.width * 0.1;
    this.height = +screen.height * 0.1;
  }
}

Minifier.prototype.width = 0;
Minifier.prototype.height = 0;

/**
 *
 * @param image
 * @returns {HTMLElement}
 */
Minifier.prototype.minify = function(image, onsuccess, onerror) {
  var srcR, destR, canvas, img, url, minifier = this;
  canvas = document.createElement("canvas");
  srcR = image.width / image.height;
  destR = this.width / this.height;
  if (srcR >= destR) {
    canvas.width = this.width;
    canvas.height = +image.height * this.width / image.width;
  } else {
    canvas.width = +image.width * this.height / image.height;
    canvas.height = this.height;
  }
  canvas.getContext("2d").drawImage(image, 0, 0, canvas.width, canvas.height);
  img = document.createElement("img");
  img.onload = function(e) {
    logger.log('minify', image.width + 'x' +  image.height + ' (' + image.src.length +  ') ->', minifier.width + 'x' + minifier.height + ' (' + img.src.length + ')');
    if (onsuccess) {
      onsuccess(e);
    }
  };
  img.onerror = onerror;
  img.width = canvas.width;
  img.height = canvas.height;
  url = canvas.toDataURL("image/png");
  img.src = url;
};

module.exports = Minifier;
