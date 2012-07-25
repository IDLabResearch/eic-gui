define(['lib/jquery', 'eic/BaseSlideGenerator'],
function ($, BaseSlideGenerator) {
  "use strict";
  
  var defaultDuration = 5000;

  /** Generator that creates video slides */
  function VideoSlideGenerator(videoUrl) {
    BaseSlideGenerator.call(this);
    this.videoUrl = videoUrl;
  }

  $.extend(VideoSlideGenerator.prototype,
           BaseSlideGenerator.prototype,
  {
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
          slide = this.createBaseSlide('video', video, 5000);
      slide.once('started', $.proxy(video, 'play'));
      slide.once('stopped', $.proxy(video, 'pause'));
      delete this.$video;

      return slide;
    },
  });
  
  return VideoSlideGenerator;
});
