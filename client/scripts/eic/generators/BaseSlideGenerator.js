/*!
 * EIC BaseSlideGenerator
 * Copyright 2012, Multimedia Lab - Ghent University - iMinds
 * Licensed under GPL Version 3 license <http://www.gnu.org/licenses/gpl.html> .
 */
define(['lib/jquery', 'lib/jvent'],
function ($, EventEmitter) {
  "use strict";

  /** Generator that serves as a base for other generators. */
  function BaseSlideGenerator() {
    EventEmitter.call(this);
  }

  BaseSlideGenerator.prototype = {
    /** Initialize the generator. */
    init: function () {},

    /** Returns whether there any more. */
    hasNext: function () { return false; },

    /** Get the next slide. */
    next: function () { return null; },

    /** Prepare the upcoming slides if applicable (not guaranteed to be called). */
    prepare: function () { },

    /** Create a base slide witht the specified class, content, and duration. */
    createBaseSlide: function (cssClass, content, duration) {
      var slide = new EventEmitter();

      // Create slide element.
      var $wrapper = $('<div>').addClass('inner');
      slide.$element = $('<div>').addClass('slide')
                                 .addClass(cssClass)
                                 .append($wrapper.append(content));

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
