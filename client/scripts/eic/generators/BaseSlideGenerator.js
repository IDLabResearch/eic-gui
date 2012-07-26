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
    
    createBaseSlide: function (cssClass, content, duration) {
      var slide = new EventEmitter();
      
      // Create slide element.
      slide.$element = $('<div>').addClass('slide')
                                 .addClass(cssClass)
                                 .append(content);

      // Set duration.
      slide.duration = duration;
      
      // Set start and stop functions.
      slide.start = $.proxy(slide, 'emit', 'started');
      slide.stop  = $.proxy(slide, 'emit', 'stopped');
      
      return slide;
    },
  };
  
  return BaseSlideGenerator;
});
