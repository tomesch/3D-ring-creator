define(function () {
  'use strict';
  var Heightmap = function (imageData) {
    this._imageData = imageData;
  };

  Heightmap.prototype.getHeightMap = function (scale) {
    var
    size =  this._imageData.Height * this._imageData.Width,
    res = new Float32Array(size),
    data = this._imageData.data,
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
  return Heightmap;
});