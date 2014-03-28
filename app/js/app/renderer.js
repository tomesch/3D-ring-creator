define(['three', 'container'], function (THREE, container) {
  'use strict';
  var renderer = new THREE.WebGLRenderer();
  renderer.setClearColor(0xffffff);
  renderer.setSize(container.offsetWidth, container.offsetHeight);
  container.appendChild(renderer.domElement);
  return renderer;
});
