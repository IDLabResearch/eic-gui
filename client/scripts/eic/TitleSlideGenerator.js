define(['lib/jquery', 'util/DelayedEventTriggerer', 'lib/jvent'],
function ($, delayedEventTriggerer, EventEmitter) {
  "use strict";

  var defaultDuration = 1000;

  /** Generator that creates title slides */
  function TitleSlideGenerator(title) {
    EventEmitter.call(this);
    this.title = title;
  }

  TitleSlideGenerator.prototype = {
    /** Checks whether the title slide has been shown. */
    hasNext: function () {
      return this.done !== true;
    },

    init: function () {},

    /** Advances to the title slide. */
    next: function () {
      if (!this.hasNext())
        return;

      var $title = $('<h1>').text(this.title),
          $slide = $('<div>').addClass('slide title')
                             .append($title)
                             .one('start', delayedEventTriggerer('stop', defaultDuration));

      this.done = true;

      return $slide;
    },
  };
  
  return TitleSlideGenerator;
});
