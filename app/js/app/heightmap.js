define(['filters'], function (filter) {
  'use strict';
  var Heightmap = function () {
    // COOL CONSTRUCTOR BRO
  };

  Heightmap.prototype.getHeightMap = function (imageData, scale) {
    var imageDataFiltered = filter.setGrayScale(imageData),
    size =  imageDataFiltered.height * imageDataFiltered.width,
    res = new Float32Array(size),
    data = imageDataFiltered.data,
    i = 0,
    j = 0,
    pixelValue = 0;

    // Fill array, avoid undefined value
    for (i = 0; i < size; i++) {
      res[i] = 0;
    }

    // Basic Heightmap
    for (i = 0; i < data.length; i += 4) {
      pixelValue = data[i] + data[i + 1] + data[i + 2];
      res[j++] = pixelValue / scale;
    }
    return res;
  };
  return new Heightmap();
});
