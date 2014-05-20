define(['three', 'FileSaver'], function (THREE, FileSaver) {
  'use strict';
  var download = function (data) {
    saveAs(
      new Blob([data], {type: 'text/plain;charset=utf-8'}),
      'ring.obj'
    );
  },
  exporter = {
    obj: function (geometry) {
      download(new THREE.OBJExporter().parse(geometry));
    }
  };

  return exporter;
});