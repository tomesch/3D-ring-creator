define(['three'], function (THREE) {
  'use strict';
  var download = function (data) {
    var pom = document.createElement('a');
    pom.setAttribute('href', 'data:text/plain;charset=utf-8,' + encodeURIComponent(data));
    pom.setAttribute('download', 'ring.obj');
    pom.click();
  },
  exporter = {
    obj: function (geometry) {
      download(new THREE.OBJExporter().parse(geometry));
    }
  };

  return exporter;
});