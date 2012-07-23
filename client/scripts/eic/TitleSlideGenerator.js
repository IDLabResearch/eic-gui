define(['lib/jquery', 'util/DelayedEventTriggerer', 'eic/BaseSlideGenerator'],
function ($, delayedEventTriggerer, BaseSlideGenerator) {
  "use strict";

  var defaultDuration = 1000;

  /** Generator that creates title slides */
  function TitleSlideGenerator(title) {
    BaseSlideGenerator.call(this);
    this.title = title;
  }

  $.extend(TitleSlideGenerator.prototype,
    BaseSlideGenerator.prototype,
  {
    /** Checks whether the title slide has been shown. */
    hasNext: function () {
      return this.done !== true;
    },

    /** Advances to the title slide. */
    next: function () {
      if (!this.hasNext())
        return;

      var $title = $('<h1>').text(this.title),
          $slide = this.createBaseSlide('title')
                          .append($title)
                          .one('start', delayedEventTriggerer('stop', defaultDuration));

      this.done = true;

      return $slide;
    },
  });
  
  
  return TitleSlideGenerator;
});
