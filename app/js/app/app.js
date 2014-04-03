define(['three', 'scene', 'camera', 'renderer', 'material', 'ring', 'controls'], function (THREE, scene, camera, renderer, material, ring, controls) {
  'use strict';
  var app = {
    init: function () {
      var mesh = new THREE.Mesh(ring.getGeometry(), material.wire);
      scene.add(mesh);
    },
    animate: function () {
      window.requestAnimationFrame(app.animate);
      controls.orbit.update();
      renderer.render(scene, camera);
    },
    dev: function () {
      var axisHelper = new THREE.AxisHelper(100);
      var gridHelper = new THREE.GridHelper(100, 10);
      scene.add(axisHelper);
      scene.add(gridHelper);
    }
  };
  return app;
});

