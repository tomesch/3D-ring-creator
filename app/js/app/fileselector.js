define(function () {
  'use strict';
  var
  filechange = new Event('filechange'),
  filereadcomplete = new Event('filereadcomplete'),
  Selector = function (inputElement, canvasElement) {
    this._input = inputElement;
    this._canvas = canvasElement;
    this._inputData = null;

    // Check changement in
    this._input.addEventListener('change', function (e) {
      e.preventDefault();
      window.dispatchEvent(filechange);
    }, true);
  };

  Selector.prototype.getSelectedFile = function () {
        var
        src = this._input.files[0],
        reader = new FileReader(),
        image = new Image(),
        context = this._canvas.getContext('2d'),
        parent = this;

        if (!src.type.match('image'))
        {
          console.log('File not image');
          return null;
        }

        reader.onload = function (e) {
            image.src = e.target.result;

            parent._canvas.setAttribute('width', image.width);
            parent._canvas.setAttribute('height', image.height);
            context.drawImage(image, 0, 0);
            parent._inputData = context.getImageData(0, 0, image.width, image.height);

            window.dispatchEvent(filereadcomplete);
          };
        reader.readAsDataURL(this._input.files[0]);
        return src;
      };

  Selector.prototype.setImageDataInContext = function (imageData) {
      var context = this._canvas.getContext('2d');
      context.putImageData(imageData, 0, 0, 0, 0, imageData.width, imageData.height);
    };
    
  Selector.prototype.getInputData = function () {
      return this._inputData;
    };

  return Selector;
});