define(['three'], function (THREE) {
  'use strict';
  return {
    solid: new THREE.MeshLambertMaterial({
      color: 0x000000,
      shading: THREE.FlatShading,
      side: THREE.DoubleSide
    }),
    wire: new THREE.MeshBasicMaterial({
      wireframe: true,
      color: 0x000000
    }),
    line: new THREE.LineBasicMaterial({
      color: 0x000000
    })
  };
});
