define(['three'], function (THREE) {
  'use strict';
  return {
    solid: new THREE.MeshLambertMaterial({
      color: 0x000000,
      ambient: 0x000000,
      side: THREE.DoubleSide
    }),
    shiny: new THREE.MeshPhongMaterial({
      color: 0x000000,
      specular: 0x000000,
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
