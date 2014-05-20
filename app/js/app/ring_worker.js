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
 
require(['three', 'ring'], function (THREE, Ring) {
    'use strict';
    this.postMessage('Ring worker ready');
    this.onmessage = function (msg) {
      var data = JSON.parse(msg.data),
      sections = [],
      i = 0,
      y,
      ring, geometry;
      
      for (i; i < data.sections.length; i++) {
        sections[i] = [];
        for (y = 0; y < data.sections[i].length; y++) {
          sections[i][y] = new THREE.Vector3(
            data.sections[i][y].x,
            data.sections[i][y].y,
            data.sections[i][y].z
          );
        }
      }

      ring = new Ring(sections, data.radius);
      geometry = ring.getGeometry();
      this.postMessage(JSON.stringify({vertices: geometry.vertices, faces: geometry.faces}));
    };
  }.bind(this)
);