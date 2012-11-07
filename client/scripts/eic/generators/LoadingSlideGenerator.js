define(['lib/jquery', 'eic/generators/BaseSlideGenerator'],
function ($, BaseSlideGenerator) {
  "use strict";

  /** Generator that creates waiting slides. */
  function LoadingSlideGenerator() {
    BaseSlideGenerator.call(this);
    this.waiting = true;
  }

  $.extend(LoadingSlideGenerator.prototype,
    BaseSlideGenerator.prototype,
  {
    hasNext: function () {
      return this.waiting;
    },

    next: function () {
      if (!this.hasNext())
        return;

      console.log('LoadingSlideGenerator is still waiting.');
      var $title = $('<h1>').text("Loading your personal movie…"),
          slide = this.createBaseSlide('title', $title, 500);

      return slide;
    },

    stopWaiting: function () {
      console.log('LoadingSlideGenerator stops waiting.');
      this.waiting = false;
    },
  });

  return LoadingSlideGenerator;
});
