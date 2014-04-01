require.config({
  baseUrl: 'js/app',
  shim: {
    'threeCore': {exports: 'THREE'},
    'OrbitControls': {deps: ['threeCore'], exports: 'THREE'}
  },
  paths: {
    three: '../lib/three',
    threeCore: '../lib/threejs/build/three.min',
    OrbitControls: '../lib/threejs-controls/controls/OrbitControls'
  }
});

require(['app'], function (app) {
  'use strict';
  app.init();
  app.dev();
  app.animate();
});
