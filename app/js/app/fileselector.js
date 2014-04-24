define(function () {
  'use strict';
  var
  filechange = new Event('filechange'),
  Selector = function (inputElement) {
    this._inputElement = inputElement;
    console.log(this._inputElement);

    this._inputElement.addEventListener('change', function (e) {
      e.preventDefault();
      window.dispatchEvent(filechange);
    }, true);
  };
  Selector.prototype.getSelectedFile = function () {
        var src = this._inputElement.files[0];
        if (!src.type.match('image'))
        {
          src = null;
        }

        return src;
      };

  return Selector;
});