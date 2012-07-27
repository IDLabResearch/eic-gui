define(['lib/jquery', 'lib/jplayer.min'], function ($, JPlayer) {
  "use strict";
  
  function SlidePresenter(container, generator, audioContainer) {
    this.$container = $(container);
    this.$audioContainer = $(audioContainer);
    this.generator = generator;
    
    this.$audioContainer.jPlayer({
      ready: function () {

      },
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
          // remove children that were transitioning out
          self.$container.children('.transition-out').remove();
          // start the transition of other children
          self.$container.children().addClass('transition-out');
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
            //var audioEl = $("<audio src='" + currentSlide.audioURL + "' autoplay='autoplay' style='display: none;'/>");
            self.$audioContainer.jPlayer("setMedia", {mp3: currentSlide.audioURL}).jPlayer("play");
            console.log("Playing " + currentSlide.audioURL);

          //self.$container.append(audioEl);
          }
          
          window.setTimeout(showNext, nextSlide.duration);
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
