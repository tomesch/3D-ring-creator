define(['three', 'container'], function (THREE, container) {
  'use strict';
  var camera = new THREE.PerspectiveCamera(75, container.offsetWidth / container.offsetHeight, 0.1, 1000);
  camera.position.z = 5;
  return camera;
});
