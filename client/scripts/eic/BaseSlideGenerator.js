define(['lib/jquery', 'lib/jvent'],
function ($, EventEmitter) {
  "use strict";

  /** Generator that serves as a base for other generators. */
  function BaseSlideGenerator() {
    EventEmitter.call(this);
  }

  BaseSlideGenerator.prototype = {
    init: function () {},
    
    hasNext: function () { return false; },

    next: function () { return null; },
    
    createBaseSlide: function (cssClass, content, onStart) {
      var $slide = $('<div>').addClass('slide')
                             .addClass(cssClass)
                             .append(content);
      
      if (onStart) {
        if (typeof(onStart) === 'number') {
          var duration = onStart;
          onStart = function (event) {
            window.setTimeout(function () {
              $(event.target).trigger('stop');
            }, duration);
          };
        }
        $slide.one('start', onStart);
      }
      
      return $slide;
    },
  };
  
  return BaseSlideGenerator;
});
