importScripts('/js/lib/requirejs/require.js');

require.config({
  baseUrl: '/js/app',
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

require(['constraints'], function (Constraint) {
  'use strict';
  var
  res = false,
  constraint = new Constraint();

  self.onmessage = function (e) {
    res = constraint.isHeightmapValid(e.data.heightmap, e.data.width, e.data.maxSlope);
    self.postMessage(res);
  };

});
