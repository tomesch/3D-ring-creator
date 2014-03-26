require.config({
  baseUrl: 'js/app',
  shim: {
    'three': {exports: 'THREE'}
  },
  paths: {
    three: '../lib/threejs/build/three.min'
  }
});

require(['app'], function (app) {
  'use strict';
  app.init();
});
