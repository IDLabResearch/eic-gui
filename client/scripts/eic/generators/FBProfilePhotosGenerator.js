define(['lib/jquery', 'eic/generators/BaseSlideGenerator'], function ($, BaseSlideGenerator) {
  "use strict";

  var defaultDuration = 1200;

  /** Generator of images slides from Facebook User Profile search results.
   * Parameters: a facebookconnector of a logged in fb user and no of maxResutls
   */
  function FBProfilePhotosGenerator(profile, maxResults) {
    BaseSlideGenerator.call(this);
    this.facebookConnector = profile.connector;
    this.maxResults = maxResults || 5;
    this.slides = [];
  }

  $.extend(FBProfilePhotosGenerator.prototype, BaseSlideGenerator.prototype, {
    /** Checks whether any slides are left. */
    hasNext: function () {
      return this.slides.length > 0;
    },

    /** Fetches a list of images about the user in which he is tagged. */
    init: function () {
      if (this.inited)
        return;

      var self = this;
      this.facebookConnector.init();

      this.facebookConnector.get('photos?fields=source', function (response) {
        response.data.slice(0, self.maxResults).forEach(function (photo) {
          self.addImageSlide(photo.source);
        });
      });

      this.inited = true;
    },

    /** Advances to the next slide. */
    next: function () {
      return this.slides.shift();
    },

    /** Adds a new image slide. */
    addImageSlide: function (imageUrl, duration) {
      var $image = imageUrl;
      if (typeof imageUrl === 'string')
        $image = $('<img>').prop('src', imageUrl)
                           .css({ 'min-height': '600px' });

      var $figure = $('<figure>').append($image);
      var slide = this.createBaseSlide('image', $figure, duration || defaultDuration);
      slide.on('started', function () { setTimeout($.proxy($image, 'addClass', 'zoom')); });

      this.slides.push(slide);
      this.emit('newSlides');
    },
  });

  return FBProfilePhotosGenerator;
});
