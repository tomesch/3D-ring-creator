define(['three', 'threejs/cameras', 'threejs/container'], function (THREE, camera, container) {
  'use strict';
  return {
    orbit: new THREE.OrbitControls(camera, container)
  };
});