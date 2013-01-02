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
      swfPath: "/scripts/lib",
      supplied: "mp3",
      wmode:"window"
    });
  }

  SlidePresenter.prototype = {
    start: function () {
      if (this.started)
        return;

      this.generator.init();

      var self = this;
      var currentSlide, nextSlide;

      function loadNext() {
        // if slides are available, load them
        if (self.generator.hasNext()) {
          console.log('[' + Math.round(+new Date() / 1000) + '] Loading new slide');
          nextSlide = self.generator.next();

          // If the next has audio, but playback is still going on
          if (nextSlide.audioURL && !self.$audioContainer.data().jPlayer.status.paused)
            // Wait until playback has ended to show the next slide
            self.$audioContainer.one($.jPlayer.event.ended, showNext);
          else
            // The next slide can start, since no audio will overlap
            showNext();
        }
        // else, wait for new slides to arrive
        else {
          self.generator.once('newSlides', loadNext);
          console.log('[' + Math.round(+new Date() / 1000) + '] No new slides!');
        }
      }

      function showNext() {
        console.log('[' + Math.round(+new Date() / 1000) + '] Showing new slide');
        // remove children that are still transitioning out
        self.$container.children('.transition-out').remove();
        // start the transition of other children
        var children = self.$container.children();
        children.addClass('transition-out');
        window.setTimeout(function () {
          children.remove();
        }, 1000);

        // start next slide
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
        if (nextSlide.duration)
          window.setTimeout(loadNext, nextSlide.duration);
      }
      loadNext();

      this.started = true;
    }
  };

  return SlidePresenter;
});
