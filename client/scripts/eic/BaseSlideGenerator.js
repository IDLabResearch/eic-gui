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
      var slide = new EventEmitter();
      
      // Create slide element.
      slide.$element = $('<div>').addClass('slide')
                                 .addClass(cssClass)
                                 .append(content);
      
      // If `onStart` is a number, it is the duration of the slide,
      // thus create a stop callback that fires after that duration.
      if (typeof(onStart) === 'number') {
        var duration = onStart;
        onStart = function (event) { window.setTimeout(slide.stop, duration); };
      }

      // Set start and stop functions.
      slide.start = onStart || $.noop;
      slide.stop = function () { slide.emit('stopped'); };
      
      return slide;
    },
  };
  
  return BaseSlideGenerator;
});
