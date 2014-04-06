define(['three', 'scene', 'camera', 'renderer', 'material', 'ring', 'controls', 'exporters'], function (THREE, scene, camera, renderer, material, Ring, controls, exporters) {
  'use strict';
  var app = {
    init: function () {
      var test = [[
        new THREE.Vector3(0, 0, 0),
        new THREE.Vector3(0, 5, 0),
        new THREE.Vector3(2.5, 5, 0),
        new THREE.Vector3(5, 5, 0),
        new THREE.Vector3(5, 0, 0),
        new THREE.Vector3(0, 0, 0)
      ],
      [
        new THREE.Vector3(0, 0, 0),
        new THREE.Vector3(0, 5, 0),
        new THREE.Vector3(2.5, 5, 0),
        new THREE.Vector3(5, 5, 0),
        new THREE.Vector3(5, 0, 0),
        new THREE.Vector3(0, 0, 0)
      ],
      [
        new THREE.Vector3(0, 0, 0),
        new THREE.Vector3(0, 5, 0),
        new THREE.Vector3(2.5, 5, 0),
        new THREE.Vector3(5, 5, 0),
        new THREE.Vector3(5, 0, 0),
        new THREE.Vector3(0, 0, 0)
      ],
      [
        new THREE.Vector3(0, 0, 0),
        new THREE.Vector3(0, 5, 0),
        new THREE.Vector3(2.5, 5, 0),
        new THREE.Vector3(5, 5, 0),
        new THREE.Vector3(5, 0, 0),
        new THREE.Vector3(0, 0, 0)
      ]
      ],
      ring = new Ring(test, 10),
      mesh = new THREE.Mesh(ring.getGeometry(), material.wire);

      scene.add(mesh);
    },
    animate: function () {
      window.requestAnimationFrame(app.animate);
      controls.orbit.update();
      renderer.render(scene, camera);
    },
    dev: function () {
      var axisHelper = new THREE.AxisHelper(100),
      gridHelper = new THREE.GridHelper(100, 10);
      scene.add(axisHelper);
      scene.add(gridHelper);
    }
  };
  return app;
});

