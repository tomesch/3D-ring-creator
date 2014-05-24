define(function () {
  'use strict';
  var filechange = new Event('filechange'),
  filereadcomplete = new Event('filereadcomplete'),
  Selector = function (inputElement, canvasElement) {

    this._input = document.createElement('input');
    this._input.setAttribute('type', 'file');
    this._input.style.display = 'none';
    document.body.appendChild(this._input);

    this.image = document.createElement('img');
    this.image.style.display = 'none';
    document.body.appendChild(this.image);

    this._input.addEventListener('change', function (e) {
      e.preventDefault();
      window.dispatchEvent(filechange);
    }, true);
  };

  Selector.prototype.select = function select() {
    this._input.click();
  };

  Selector.prototype.getSelectedFile = function getSelectedFile() {
    var src = this._input.files[0],
    reader = new FileReader();
    
    if (src.type.match('image')) {
      reader.onloadend = function () {
        this.image.src = reader.result;
        console.info('Selected image width: ' + this.image.width + 'px');
        console.info('Selected image height: ' + this.image.height + 'px');
        window.dispatchEvent(filereadcomplete);
      }.bind(this);

      reader.readAsDataURL(this._input.files[0]);
    }
    else {
      console.error('Selected file is not an image');
    }

    return src;
  };

  Selector.prototype.urlToData = function (urlData) {
    var canvas = document.createElement('canvas'),
    context = canvas.getContext('2d'),
    image = document.createElement('img');

    image.src = urlData;
    canvas.setAttribute('width',  image.width);
    canvas.setAttribute('height', image.height);

    context.drawImage(image, 0, 0, image.width, image.height);
    return context.getImageData(0, 0, image.width, image.height);
  };
  return new Selector();
});
