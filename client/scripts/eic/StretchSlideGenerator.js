define(['lib/jquery', 'eic/BaseSlideGenerator'],
function ($, BaseSlideGenerator) {
  "use strict";

  var defaultDuration = 1000;

  function StretchSlideGenerator(generator, duration) {
    BaseSlideGenerator.call(this);

    this.generator = generator;
    this.durationLeft = duration;
    this.slides = [];
  }

  $.extend(StretchSlideGenerator.prototype,
           BaseSlideGenerator.prototype,
  {
    init: function () {
      this.generator.init();
      this.generator.on('newSlides', $.proxy(this, 'emit', 'newSlides'));
    },

    hasNext: function () {
      return this.slides.length > 0 || this.generator.hasNext();
    },
    
    next: function () {
      // Add possible new slides.
      while (this.generator.hasNext())
        this.slides.push(this.generator.next());
      if (!this.slides.length)
        throw "Next was called while no slides were left.";
      
      // Calculate desired duration of all remaining slides.
      var totalDuration = this.slides.reduce(function (sum, slide) { return sum + slide.duration; }, 0);

      // The duration of the next slide is its fraction of the total duration, rescaled to the time left.
      var nextSlide = this.slides.shift();
      nextSlide.duration = (nextSlide.duration / totalDuration) * this.durationLeft;
      this.durationLeft -= nextSlide.duration;
      
      // Return the slide with adjusted duration.
      return nextSlide;
    },
  });
  
  
  return StretchSlideGenerator;
});
