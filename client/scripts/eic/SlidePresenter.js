define(['lib/jquery', 'lib/jplayer.min'], function ($, JPlayer) {
  "use strict";
  
  /*
   * CLEANUP
   **/

  function SlidePresenter(container, generator, audioContainer) {
    this.$container = $(container);
    this.$audioContainer = $(audioContainer);
    this.generator = generator;

    this.$audioContainer.jPlayer({
      ready: function () {},
      errorAlerts: true,
      swfPath: "/js",
      supplied: "mp3"
    });
  }

  SlidePresenter.prototype = {
    start: function () {
      if (this.started)
        return;

      this.generator.init();

      var self = this;
      var currentSlide;

      function showNext() {
        // if slides are available, show them
        if (self.generator.hasNext()) {
          console.log('[' + Math.round(+new Date() / 1000) + ']Showing new slide');
          // remove children that are still transitioning out
          self.$container.children('.transition-out').remove();
          // start the transition of other children
          var children = self.$container.children();
          children.addClass('transition-out');
          window.setTimeout(function () {
            children.remove();
          }, 1000);
          // add the next slide and start it
          var nextSlide = self.generator.next();
          self.$container.prepend(nextSlide.$element);
          nextSlide.start();

          // stop the previous slide
          if (currentSlide)
            currentSlide.stop();
          currentSlide = nextSlide;

          // if slide contains a description, send it to TTS service
          if (currentSlide.audioURL) {
            console.log("URL " + currentSlide.audioURL + " detected in slide!");

            self.$audioContainer.jPlayer("setMedia", {mp3: currentSlide.audioURL}).jPlayer("play");
            console.log("Playing " + currentSlide.audioURL);
          }
          window.setTimeout(showNext, nextSlide.duration);
        }
        // else, wait for new slides to arrive
        else {
          self.generator.once('newSlides', showNext);
          console.log('[' + Math.round(+new Date() / 1000) + ']No new slides!');
        }
      }
      showNext();

      this.started = true;
    }
  };

  return SlidePresenter;
});
