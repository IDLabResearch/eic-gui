/*!
 * EIC LoadingSlideGenerator
 * Copyright 2012, Multimedia Lab - Ghent University - iMinds
 * Licensed under GPL Version 3 license <http://www.gnu.org/licenses/gpl.html> .
 */
define(['lib/jquery', 'eic/Logger', 'eic/generators/BaseSlideGenerator'],
function ($, Logger, BaseSlideGenerator) {
  "use strict";
  var logger = new Logger("LoadingSlideGenerator");

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

      logger.log('Still waiting');
      var $title = $('<h1>').text("Loading your personal movie…"),
          slide = this.createBaseSlide('title', $title, 500);

      return slide;
    },

    stopWaiting: function () {
      logger.log('Stopped waiting');
      this.waiting = false;
    },
  });

  return LoadingSlideGenerator;
});
