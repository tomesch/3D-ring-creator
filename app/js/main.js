require.config({
  baseUrl: 'js/app',
  shim: {
    'dat': {exports: 'dat'},
    'threeCore': {exports: 'THREE'},
    'OrbitControls': {deps: ['threeCore'], exports: 'THREE'},
    'OBJExporter': {deps: ['threeCore'], exports: 'THREE'}
  },
  paths: {
    three: '../lib/three',
    threeCore: '../lib/threejs/build/three',
    dat: '../lib/dat-gui/build/dat.gui',
    OrbitControls: '../lib/threejs-controls/controls/OrbitControls',
    OBJExporter: '../lib/threejs-exporters/exporters/OBJExporter',
    two: '../lib/two/build/two'
  }
});

require(['app'], function (app) {
  'use strict';
  app.init();
  app.dev();
  app.animate();
});
