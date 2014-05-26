define(['dat'], function (dat) {
  'use strict';
  var Gui = function Gui() {
    this.gui = null;
    this.param = {
      circumference: 50,
      export: function () {
        var exportEvent = new Event('export');
        window.dispatchEvent(exportEvent);
      },
      image: function () {
        var importEvent = new Event('import');
        window.dispatchEvent(importEvent);
      },
      reset: function () {
        var resetEvent = new Event('reset');
        window.dispatchEvent(resetEvent);
      }
    };
  };
  
  Gui.prototype.init = function init() {
    this.gui = new dat.GUI();
    this.gui.add(this.param, 'circumference').min(36).max(77).step(1).name('Circumference').listen().onFinishChange(function (value) {
      var circumferencechange = new Event('circumferencechange');
      window.dispatchEvent(circumferencechange);
    });
    this.gui.add(this.param, 'image').name('Import image');
    this.gui.add(this.param, 'export').name('Export as OBJ');
    this.gui.add(this.param, 'reset').name('Reset heightmap');
  };

  return new Gui();
});