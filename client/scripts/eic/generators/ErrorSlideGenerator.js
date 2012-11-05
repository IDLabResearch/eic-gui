define(['lib/jquery', 'eic/generators/BaseSlideGenerator'],
function ($, BaseSlideGenerator) {
  "use strict";

  /*
   * EXTEND
   * CLEANUP
   **/

  var defaultDuration = 10000;

  /** Generator that creates a title slide for a topic. */
  function ErrorSlideGenerator(errorText) {
    BaseSlideGenerator.call(this);
    
    this.errorText = errorText;
  }

  $.extend(ErrorSlideGenerator.prototype,
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
      var $content = $('<div>'),
        $text = $('<h1>').text(this.errorText),
        $link = $('<a>', {
          text: 'Try again',
          title: 'reload',
          href: '#',
          click: function () { location.reload(); }
        });
      $($content).append($text);
      $($content).append($link);
      var slide = this.createBaseSlide('error', $content, defaultDuration);
      
      this.done = true;

      return slide;
    },
  });
  
  return ErrorSlideGenerator;
});