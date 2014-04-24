define(['two'], function (Two) {
  'use strict';
  var TwoScene = function (container) {
    var params = {
      width: container.offsetWidth,
      height: container.offsetHeight
    };
    return new Two(params).appendTo(container);
  };
  return TwoScene;
});