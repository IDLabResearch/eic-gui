define(['lib/jquery'], function ($) {
  "use strict";

  function TopicSlidePresenter(container, generator) {
    this.$container = $(container);
    this.generator = generator;
  }

  TopicSlidePresenter.prototype = {
    start: function () {
      if (this.started)
        return;
      
      this.generator.init();
      
      var self = this;
      var currentSlide;
      
      function showNext() {
        // if slides are available, show them
        if (self.generator.hasNext()) {
          // remove children that were transitioning out
          self.$container.children('.transition-out').remove();
          // start the transition of other children
          self.$container.children().addClass('transition-out');
          // add the next slide and start it
          var nextSlide = self.generator.next();
          self.$container.prepend(nextSlide.$element);
          nextSlide.start();
          window.setTimeout(showNext, nextSlide.duration);
          // stop the previous slide
          if (currentSlide)
            currentSlide.stop();
          currentSlide = nextSlide;
        }
        // else, wait for new slides to arrive
        else {
          self.generator.once('newSlides', showNext);
        }
      }
      showNext();

      this.started = true;
    }
  };

  return SlidePresenter;
});

/*
 * playScene: function (text) {
          var tts = new TTSGenerator();
          tts.once('speechReady', function (event, data) {
            this.sndUrl = data.snd_url;
            this.duration = data.snd_time;
            this.emit('playReady',this.sndUrl);
          });
          tts.getSpeech(text, 'en_GB');
        },
 */