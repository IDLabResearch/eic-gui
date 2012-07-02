define(['lib/jquery', 'lib/jvent'],
function ($, EventEmitter) {
  "use strict";

  /** Generator that creates video slides */
  function VideoSlideGenerator(videoUrl) {
    EventEmitter.call(this);
    this.videoUrl = videoUrl;
  }

  VideoSlideGenerator.prototype = {
    /** Checks whether the video slide has been shown. */
    hasNext: function () {
      return this.$video !== undefined;
    },

    init: function () {
      this.$video = $('<video>').append($('<source>').attr('src', this.videoUrl));
    },

    /** Advances to the video slide. */
    next: function () {
      if (!this.hasNext())
        return;

      var video = this.$video[0],
          $slide = $('<div>').addClass('slide video')
                             .append(video)
                             .on('start', function () { video.play(); });
      video.addEventListener('ended', function () { $slide.trigger('stop'); });
      delete this.$video;

      return $slide;
    },
  };
  
  return VideoSlideGenerator;
});
