/*!
 * EIC ErrorSlideGenerator
 * Copyright 2012, Multimedia Lab - Ghent University - iMinds
 * Licensed under GPL Version 3 license <http://www.gnu.org/licenses/gpl.html> .
 */
define(['lib/jquery', 'eic/generators/BaseSlideGenerator'],
function ($, BaseSlideGenerator) {
  "use strict";

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
          href: '#',
          click: function () { location.reload(); }
        });
      $content.append($text, $link);
      var slide = this.createBaseSlide('error', $content, 0);
      this.done = true;

      return slide;
    },
  });

  return ErrorSlideGenerator;
});
