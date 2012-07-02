define(['lib/jquery'], function ($) {
  "use strict";

  function TitleSlideGenerator(title) {
    this.title = title;
  }

  TitleSlideGenerator.prototype = {
    hasNext: function () {
      return this.done !== true;
    },

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
