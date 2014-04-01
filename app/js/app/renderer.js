define(['three', 'container'], function (THREE, container) {
  'use strict';
  var renderer = new THREE.WebGLRenderer();
  renderer.setSize(container.offsetWidth, container.offsetHeight);
  renderer.setClearColor(0xffffff, 1);
  container.appendChild(renderer.domElement);
  return renderer;
});
