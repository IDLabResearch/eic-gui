define(['lib/jquery', 'util/DelayedEventTriggerer', 'lib/jvent'],
function ($, delayedEventTriggerer, EventEmitter) {
  "use strict";

  /** Generator that serves as a base for other generators. */
  function BaseSlideGenerator() {
    EventEmitter.call(this);
  }

  BaseSlideGenerator.prototype = {
    init: function () {},
    
    hasNext: function () { return false; },

    next: function () { return null; },
    
    createBaseSlide: function (cssClass) {
      var $slide = $('<div>').addClass('slide')
                             .addClass(cssClass);
      return $slide;
    },
  };
  
  return BaseSlideGenerator;
});
