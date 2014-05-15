define(['dat'], function (dat) {
  'use strict';
  var Gui = function Gui() {
    this.gui = null;
    this.param = {
      circumference: 50,
      export: function () {
        // handle OBJ export
      },
      image: function () {
        // handle image upload
      }
    };
  };
  
  Gui.prototype.init = function init() {
    this.gui = new dat.GUI();
    this.gui.add(this.param, 'circumference').min(36).max(77).step(1).onChange(function (value) {
      var circumferencechange = new Event('circumferencechange');
      window.dispatchEvent(circumferencechange);
    });
    this.gui.add(this.param, 'image');
    this.gui.add(this.param, 'export');
  };

  return new Gui();
});