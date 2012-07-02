define(['lib/jquery'], function ($) {
  "use strict";

  /** Generator that creates title slides */
  function TitleSlideGenerator(title) {
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
                             .append($title);

      this.done = true;

      return $slide;
    },
  };
  
  return TitleSlideGenerator;
});
