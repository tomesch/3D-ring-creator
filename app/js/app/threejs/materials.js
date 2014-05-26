define(['three'], function (THREE) {
  'use strict';
  return {
    solid: new THREE.MeshLambertMaterial({
      color: 0x4c4c52
    }),
    shiny: new THREE.MeshPhongMaterial({
      color: 0x646464,
      shading: THREE.SmoothShading
    }),
    wire: new THREE.MeshBasicMaterial({
      wireframe: true,
      vertexColors: THREE.VertexColors,
      color: 0x000000
    }),
    line: new THREE.LineBasicMaterial({
      color: 0x000000
    })
  };
});
