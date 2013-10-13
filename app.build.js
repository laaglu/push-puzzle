({
  appDir: "./",
  baseUrl: "js",
  dir: "../push-puzzle.optimized",
  name: "main",
  include: "vendor/almond",
  optimize: 'uglify2',
  optimizeCss: 'standard',
  preserveLicenseComments: false,
  generateSourceMaps: false,
  removeCombined: true,
  paths: {
    jquery: 'vendor/zepto-1.0',
    underscore: 'vendor/underscore',
    backbone: 'vendor/backbone',
    moment: 'vendor/moment-langs-2.2.1.min',
    handlebars: 'vendor/handlebars'
  },
  shim: {
    'jquery': {
      exports: '$'
    },
    'handlebars': {
      exports: 'Handlebars'
    }
  }
})