define(['three'], function (THREE) {
  'use strict';
  return {
    solid: new THREE.MeshLambertMaterial({
      color: 0x000000,
      shading: THREE.FlatShading
    }),
    wire: new THREE.MeshBasicMaterial({wireframe: true})
  };
});
