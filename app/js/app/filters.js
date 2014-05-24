define(function () {
  'use strict';
  var Filter = function (imageData) {
    // COOL CONSTRUCTOR BRO
  };

  Filter.prototype.setGrayScale = function (imageData) {
    var x = 0,
    y = 0,
    i = 0,
    avg = 0;

    for (y = 0; y < imageData.height; y++) {
      for (x = 0; x < imageData.width; x++) {
        // Get the pixel position in the data table
        i = (y * 4) * imageData.width + x * 4;
        avg = (imageData.data[i] + imageData.data[i + 1] + imageData.data[i + 2]) / 3;
        imageData.data[i] = avg;
        imageData.data[i + 1] = avg;
        imageData.data[i + 2] = avg;
      }
    }
    return imageData;
  };

  return new Filter();
});