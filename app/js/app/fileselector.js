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

            //Performance issues for images bigger than 500*500 so we resize if ours is that big
            parent.resizeImageTooBig(image, 200, 200);

            context.drawImage(image, 0, 0, parent._canvas.width, parent._canvas.height);

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

  Selector.prototype.resizeImageTooBig = function (image, MAX_WIDTH, MAX_HEIGHT) {
    var
    width = image.width,
    height = image.height;

    if (width > MAX_WIDTH) {
      height = Math.floor(height * MAX_WIDTH / width);
      width = MAX_WIDTH;
    }
    if (height > MAX_HEIGHT) {
      width = Math.floor(width * MAX_HEIGHT / height);
      height = MAX_HEIGHT;
    }

    this._canvas.setAttribute('width', width);
    this._canvas.setAttribute('height', height);
  };

  return Selector;
});
