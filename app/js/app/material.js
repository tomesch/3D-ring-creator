define(['three'], function (THREE) {
  'use strict';
  return {
    solid: new THREE.MeshLambertMaterial({
      color: 0x000000,
      shading: THREE.FlatShading
    }),
    wire: new THREE.MeshBasicMaterial({wireframe: true}),
    line: new THREE.LineBasicMaterial({color: 0xff00f0})
  };
});
