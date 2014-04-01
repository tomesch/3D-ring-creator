define(['three', 'scene', 'camera', 'renderer', 'material', 'ring', 'controls'], function (THREE, scene, camera, renderer, material, ring, controls) {
  'use strict';
  var app = {
    init: function () {
      var mesh = new THREE.Line(ring.getGeometry(), material.line);
      scene.add(mesh);
      renderer.render(scene, camera);
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
