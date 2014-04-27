'use strict';

var SVGConstants = require('common/libsvg');
require('common/Polyfills');
var ViewBase = require('./ViewBase');
var GameTemplate = require('./templates/GameTemplate');

module.exports = ViewBase.extend({
  inactive: 'inactive2',
  template: GameTemplate,
  el:'#gameView',
  ID_CLIP_PATH: 'cp',
  ID_CLIP_RECT: 'cpr',
  ID_IMAGE: 'puzzle',
  ID_TILE: 't',
  MARGIN: 3,
  STYLE: {
    borderIn: 'border-in',
    borderOut: 'border-out',
    tileBorder: 'tile-border'
  },
  /**
   * The source image svg element
   * @type {SVGSVGElement}
   */
  srcSvg: null,
  /**
   * The puzzle root svg element
   * @type {SVGSVGElement}
   */
  pushSvg: null,
  /**
   * BBox of the puzzle image
   * @type {SVGRect}
   */
  bbox: null,
  /**
   *  The tile id of the tile representing the hole
   * @type {Number}
   */
  hole: 0,
  /**
   * Width of the puzzle border
   * @type {Number}
   */
  xcount: 0,
  /**
   * Number of puzzle tiles in a column
   * @type {Number}
   */
  ycount: 0,
  /**
   * The game tiles (upper left has index 0,
   * lower right has coordinate length - 1)
   * There are xcount * ycount -1 tiles (-1
   * is for the hole)
   * @type {SVGUseElement[]}
   */
  tiles: null,
  /**
   * True when the game has begun
   * @type {Boolean}
   */
  playing: false,
  /**
   * Use to free the UI at specific times (when displaying help,
   * when loading a new level, ...)
   * @type {Boolean}
   */
  frozen: false,
  /**
   * The timeoutID of a timer to briefly display the puzzle assembled
   * @type {Number}
   */
  waitTimer: -1,
  /**
   * The intervalId of a timer to time scrambles apart
   * @type {Number}
   */
  scrambleTimer: -1,

  bind: function(model) {
    // Re-render only if the model has changed or the difficulty has changed
    if (this.model !== model || this.difficulty !== model.get('difficulty')) {
      this.model = model;
      this.difficulty = model.get('difficulty');
      this.render();
    }
    return this;
  },

  render : function() {
    // Instantiate the template
    var tpl = $(this.template({id: this.model.id}));
    document.webL10n.translate(tpl[0]);
    this.replaceContent(tpl);

    // Cancel pending animations
    var view = this;
    if (this.waitTimer != -1) {
      window.clearTimeout(this.waitTimer);
      this.waitTimer = -1;
    }
    if (this.scrambleTimer != -1) {
      window.clearInterval(this.scrambleTimer);
      this.scrambleTimer = -1;
    }

    // Load the game image
    this.model.readImage({
      success: function success(svg) {
        view.srcSvg = svg;
        view.generate();
      }
    });
    return this;
  },

  generate : function () {
    var i, j, len, index,
      rootSvg,
      view,
      defs,
      imgGroup,
      childNodes,
      viewBox,
      width, height,
      borderWidth, borderHeight,
      borderRx, borderRy,
      borderOut, borderIn,
      clipPath, clipRect,
      tileDef, tileClipPath, tileTransform,
      xform, imgUse, tileBorder,
      state;

    rootSvg = document.createSVGSVGElement();
    view = this;

    // Touch specific handlers
    $(rootSvg).on('touchstart', function(event) {
      console.log(event);
      var touch = event.originalEvent.changedTouches[0];
      view.touchid = touch.identifier;
      view.onEvent(touch);
      event.preventDefault();
      event.stopPropagation();
    });
    $(rootSvg).on('touchend touchcancel touchleave', function(event) {
      console.log(event);
      var i, len, changedTouches;
      changedTouches = event.originalEvent.changedTouches;
      for (i = 0, len = changedTouches.length; i < len; i++) {
        if (changedTouches[i].identifier === view.touchid) {
          view.touchid = null;
          break;
        }
      }
      event.preventDefault();
      event.stopPropagation();
    });
    // Mouse specific handlers
    $(rootSvg).on('mousedown', function (event) {
      console.log(event);
      view.onEvent(event);
      event.stopPropagation();
      event.preventDefault();
    });
    defs = document.createSVGDefsElement();
    rootSvg.appendChild(defs);

    // Copy the source SVG in a dedicated group inside
    // the defs
    imgGroup = document.createSVGGElement();
    imgGroup.id = this.ID_IMAGE;
    childNodes = this.srcSvg.childNodes;
    for (i = 0, len = childNodes.length; i < len; i++) {
      imgGroup.appendChild(childNodes[i].cloneNode(true));
    }
    defs.appendChild(imgGroup);

    viewBox = this.srcSvg.viewBox.baseVal;
    width = viewBox.width;
    height = viewBox.height;
    this.bbox = rootSvg.createSVGRect();
    // viewBox.assignTo(this.bbox);  FF22 reg - fixed in FF24
    this.bbox.x = viewBox.x;
    this.bbox.y = viewBox.y;
    this.bbox.width = viewBox.width;
    this.bbox.height = viewBox.height;

    // Compute the number of tiles
    if (width < height) {
      this.xcount = this.model.get('difficulty') + 3;
      this.ycount = ~~(this.xcount * height / width);
    } else {
      this.ycount = this.model.get('difficulty') + 3;
      this.xcount = ~~(this.ycount * width / height);
    }
    this.hole = this.xcount * this.ycount - 1;

    // Create a thick border with rounded corners around the
    // drawing (15% of the original drawing size, corner radius
    // 2.5% of the original drawing size)
    // Add a 3 pixel margin around the tiles
    borderWidth = ~~(0.075 * width);
    borderHeight = ~~(0.075 * height);
    borderRx = ~~(0.025 * width);
    borderRy = ~~(0.025 * height);
    borderOut = document.createSVGRectElement1(
      viewBox.x - borderWidth - this.MARGIN,
      viewBox.y - borderHeight - this.MARGIN,
      viewBox.width + 2 * (borderWidth + this.MARGIN),
      viewBox.height + 2 * (borderHeight + this.MARGIN),
      borderRx,
      borderRy);
    borderOut.className.baseVal = this.STYLE.borderOut;
    borderIn = document.createSVGRectElement1(
      viewBox.x - this.MARGIN,
      viewBox.y - this.MARGIN,
      viewBox.width + 2 * this.MARGIN,
      viewBox.height + 2 * this.MARGIN,
      borderRx,
      borderRy);
    borderIn.className.baseVal = this.STYLE.borderIn;
    rootSvg.appendChild(borderOut);
    rootSvg.appendChild(borderIn);
    rootSvg.setViewBox1(
      viewBox.x - borderWidth - this.MARGIN,
      viewBox.y - borderHeight - this.MARGIN,
      viewBox.width + 2 * (borderWidth + this.MARGIN),
      viewBox.height + 2 * (borderHeight + this.MARGIN));
    rootSvg.width.baseVal.newValueSpecifiedUnits(SVGLength.SVG_LENGTHTYPE_PERCENTAGE, 100);
    rootSvg.height.baseVal.newValueSpecifiedUnits(SVGLength.SVG_LENGTHTYPE_PERCENTAGE, 100);

    // Create the tile clip-path
    // <clipPath id='cp'>
    //  <rect id='cpr' x='0' y='0' width='130' height='130' rx='10' ry='10'/>
    // </clipPath>
    clipPath = document.createSVGClipPathElement();
    clipPath.id = this.ID_CLIP_PATH;
    clipRect = document.createSVGRectElement1(
      viewBox.x,
      viewBox.y,
      width / this.xcount,
      height / this.ycount,
      borderRx,
      borderRy);
    clipRect.id = this.ID_CLIP_RECT;
    clipPath.appendChild(clipRect);
    defs.appendChild(clipPath);

    // Create the tiles
    this.tiles = new Array(this.xcount * this.ycount);
    for (i = 0; i < this.xcount; i++) {
      for (j = 0; j < this.ycount; j++) {
        index = i * this.ycount + j;
        if (index != this.hole) {
          // Create the tile definition
          // Each tile definition has the following structure
          // <g id='tileXXX'>
          //  <g style='clip-path:url(#cp)'>
          //   <g transform='translate(-260,0)'>
          //    <use x='0' y='0' xlink:href='#puzzle'/>
          //   </g>
          //  </g>
          //  <use x='0' y='0' xlink:href='#cp1r' style='fill:none;stroke:black;'/>
          // </g>
          tileDef = document.createSVGGElement();
          tileDef.id = this.ID_TILE + index;
          tileClipPath = document.createSVGGElement();
          tileClipPath.style.setProperty(SVGConstants.CSS_CLIP_PATH_PROPERTY, 'url(#' + this.ID_CLIP_PATH + ')', '');
          tileTransform = document.createSVGGElement();
          xform = rootSvg.createSVGTransform();
          xform.setTranslate(
            viewBox.x - i * width / this.xcount,
            viewBox.y - j * height / this.ycount);
          tileTransform.transform.baseVal.appendItem(xform);
          imgUse = document.createSVGUseElement();
          imgUse.x.baseVal.value = viewBox.x;
          imgUse.y.baseVal.value = viewBox.y;
          imgUse.href.baseVal = '#' + this.ID_IMAGE;
          tileBorder = document.createSVGUseElement();
          tileBorder.x.baseVal.value = viewBox.x;
          tileBorder.y.baseVal.value = viewBox.y;
          tileBorder.href.baseVal = '#' + this.ID_CLIP_RECT;
          tileBorder.className.baseVal = this.STYLE.tileBorder;
          tileDef.appendChild(tileClipPath);
          tileClipPath.appendChild(tileTransform);
          tileTransform.appendChild(imgUse);
          tileDef.appendChild(tileBorder);
          defs.appendChild(tileDef);

          // Create the tile itself
          // <use x='130' y='260' xlink:href='#tileXXX'/>
          this.tiles[index] = document.createSVGUseElement();
          this.tiles[index].href.baseVal = '#' + this.ID_TILE + index;
          rootSvg.appendChild(this.tiles[index]);
        }
      }
    }

    // Add the SVG to the HTML page
    this.$('svg').replaceWith(rootSvg);
    this.pushSvg = rootSvg;

    // Restore the previous game state if it exists, unless
    // the player has changed the difficulty
    state = this.model.get('state');
    if (state && (state.length * state[0].length === this.tiles.length)) {
      this.playing = true;
      for (i = 0; i < this.xcount; i++) {
        for (j = 0; j < this.ycount; j++) {
          this.setTile(i, j, state[i][j]);
        }
      }
    } else {
      this.playing = false;

      // Create a new game layout
      this.createState();

      // Display the puzzle in order for 1 sec, then scramble it
      this.waitTimer = window.setTimeout(function () {
        view.waitTimer = -1;
        var repeatCount = 0;
        view.scrambleTimer = window.setInterval(function () {
          var tileCount = view.xcount * view.ycount;
          var array = [];
          for (var i = 0; i < tileCount; i++) {
            array[array.length] = i;
          }
          // Shuffle the tiles
          for (i = 0; i < view.xcount; i++) {
            for (var j = 0; j < view.ycount; j++) {
              view.setTile(i, j, array.splice(~~(Math.random() * tileCount--), 1)[0]);
            }
          }
          repeatCount++;
          if (repeatCount >= 5) {
            view.playing = true;
            window.clearInterval(view.scrambleTimer);
            view.scrambleTimer = -1;

            // Save the game state
            view.model.update();
          }
        }, 200);
      }, 1000);
    }
  },

  gameOver: function () {
    for (var i = 0; i < this.xcount; i++) {
      for (var j = 0; j < this.ycount; j++) {
        if (!(this.getTile(i, j) === i * this.ycount + j)) {
          return false;
        }
      }
    }
    return true;
  },

  /**
   * @param {Number} x
   * @param {Number} y
   * @param {Number} value
   */
  setTile: function (x, y, value) {
    var state = this.model.get('state');
    state[x][y] = value;
    if (value != this.hole) {
      this.tiles[value].x.baseVal.value = x * this.bbox.width / this.xcount;
      this.tiles[value].y.baseVal.value = y * this.bbox.height / this.ycount;
    }
  },

  /**
   * @param {Number} x
   * @param {Number} y
   * @returns {Number}
   */
  getTile: function (x, y) {
    return this.model.get('state')[x][y];
  },

  /**
   *
   * @param {Event} event
   */
  onEvent: function (event) {
    if (this.playing) {
      var state = this.model.get('state');
      var coords = this.getTileCoordinates(event);
      if (coords != null) {
        var x = ~~coords.x;
        var y = ~~coords.y;
        var shifted = false;
        var i, j;
        for (i = 0; i < this.xcount; i++) {
          if (state[i][y] == this.hole) {
            if (x < i) {
              for (j = i; j > x; j--) {
                this.setTile(j, y, this.getTile(j - 1, y));
              }
            } else {
              for (j = i; j < x; j++) {
                this.setTile(j, y, this.getTile(j + 1, y));
              }
            }
            this.setTile(x, y, this.hole);
            shifted = true;
          }
        }
        if (!shifted) {
          for (i = 0; i < this.ycount; i++) {
            if (state[x][i] == this.hole) {
              if (y < i) {
                for (j = i; j > y; j--) {
                  this.setTile(x, j, this.getTile(x, j - 1));
                }
              } else {
                for (j = i; j < y; j++) {
                  this.setTile(x, j, this.getTile(x, j + 1));
                }
              }
              this.setTile(x, y, this.hole);
            }
          }
        }
        // Save the game state
        this.model.update();

        if (this.gameOver()) {
          this.winAnimation();
        }
      }
    }
  },

  /**
   *
   * @param {MouseEvent} event
   * @returns {SVGPoint}
   */
  getTileCoordinates: function (event) {
    var p = this.pushSvg.createSVGPoint1(event.clientX, event.clientY);
    var m = this.pushSvg.getScreenCTM().inverse();
    p = p.matrixTransform(m).subtract(this.pushSvg.createSVGPoint1(this.bbox.x, this.bbox.y)).product(this.pushSvg.createSVGPoint1(this.xcount / this.bbox.width, this.ycount / this.bbox.height)).floor();
    return this.pushSvg.createSVGRect1(0, 0, this.xcount - 1, this.ycount - 1).contains(p) ? p : null;
  },

  winAnimation: function () {
    this.playing = false;
    var view = this;
    var animCount = 0;
    var t0 = -1;
    var makeFrame = function (timestamp) {
      if (t0 == -1) {
        t0 = timestamp;
      } else {
        // Each animation cycle lasts 1.5s: 0.5s where nothing moves, followed by a 1s rotation
        var dt = Math.min(timestamp - t0, 1500);
        if (dt >= 500) {
          var progress = (dt - 500) / 1000.0;
          for (var i = 0; i < view.xcount; i++) {
            for (var j = 0; j < view.ycount; j++) {
              var index = i * view.ycount + j;
              if (index != view.hole) {
                var xformList = view.tiles[index].transform.baseVal;
                xformList.clear();
                var r = view.pushSvg.createSVGTransform();
                var angle = 360 * progress * ((animCount % 2 == 0) ? 1 : -1);
                var cx = (i + 0.5) * view.bbox.width / view.xcount;
                var cy = (j + 0.5) * view.bbox.height / view.ycount;
                r.setRotate(angle, cx, cy);
                xformList.appendItem(r);
              }
            }
          }
        }
        if (dt == 1500) {
          animCount++;
          t0 = -1;
        }
      }
      if (animCount < 5) {
        window.requestAnimationFrame(makeFrame);
      } else {
        view.playing = true;
      }
    };
    window.requestAnimationFrame(makeFrame);
  },
  createState: function() {
    var i, j, index, state = this.model.get('state');
    state = new Array(this.xcount);
    this.model.set({'state': state});
    for (i = 0; i < this.xcount; i++) {
      state[i] = new Array(this.ycount);
      for (j = 0; j < this.ycount; j++) {
        index = i * this.ycount + j;
        this.setTile(i, j, index);
      }
    }
  }
});
