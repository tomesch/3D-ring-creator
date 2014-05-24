require.config({
  baseUrl: 'js/app',
  shim: {
    'cropbox': {deps: ['jquery']},
    'fancybox' : {deps: ['jquery']},
    'FileSaver': {exports: 'FileSaver'},
    'dat': {exports: 'dat'},
    'threeCore': {exports: 'THREE'},
    'TransformControls': {deps: ['threeCore'], exports: 'THREE'},
    'OrbitControls': {deps: ['threeCore'], exports: 'THREE'},
    'OBJExporter': {deps: ['threeCore'], exports: 'THREE'}
  },
  paths: {
    cropbox: '../lib/jquery-cropbox/jquery.cropbox',
    fancybox: '../lib/fancybox/source/jquery.fancybox.pack',
    jquery: '../lib/jquery/dist/jquery',
    FileSaver: '../lib/FileSaver/FileSaver',
    three: '../lib/three',
    threeCore: '../lib/threejs/build/three',
    dat: '../lib/dat-gui/build/dat.gui',
    OrbitControls: '../lib/threejs-controls/controls/OrbitControls',
    TransformControls: '../lib/threejs-controls/controls/TransformControls',
    OBJExporter: '../lib/threejs-exporters/exporters/OBJExporter',
    two: '../lib/two/build/two'
  }
});

require(['app'], function (app) {
  'use strict';
  app.dev();
  app.init();
});
