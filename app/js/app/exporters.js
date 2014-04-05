define(['three'], function (THREE) {
  'use strict';
  return {
    obj: function (geometry) {
      return new THREE.OBJExporter().parse(geometry);
    }
  };
});
