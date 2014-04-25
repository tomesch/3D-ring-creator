define(function () {
  'use strict';
  var Filter = function (imageData) {
    this._imageData = imageData;
  };
  // Turn the image into a gray scale image 
  Filter.prototype.setGrayScale = function () {
    var
    x = 0,
    y = 0,
    i = 0,
    avg = 0;

    for (y = 0; y < this._imageData.height; y++) {
      for (x = 0; x < this._imageData.width; x++) {
        // Get the pixel position in the data table
        i = (y * 4) * this._imageData.width + x * 4;
        avg = (this._imageData.data[i] + this._imageData.data[i + 1] + this._imageData.data[i + 2]) / 3;
        this._imageData.data[i] = avg;
        this._imageData.data[i + 1] = avg;
        this._imageData.data[i + 2] = avg;
      }
    }

    return this._imageData;
  };
  return Filter;
});