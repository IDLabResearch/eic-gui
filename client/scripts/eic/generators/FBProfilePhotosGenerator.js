define(['lib/jquery', 'eic/generators/BaseSlideGenerator', 'eic/FacebookConnector'],
function ($, BaseSlideGenerator, FacebookConnector) {
  "use strict";

  var defaultDuration = 1000;

  // Generator of images slides from Facebook user profile search results.
  function FBProfilePhotosGenerator(maxResults) {
    BaseSlideGenerator.call(this);
    this.fbConnector = new FacebookConnector();
    this.maxResults = maxResults || 5;
    this.slides = [];
  }

  $.extend(FBProfilePhotosGenerator.prototype,
           BaseSlideGenerator.prototype,
  {
    /** Checks whether any slides are left. */
    hasNext: function () {
      return this.slides.length > 0;
    },

    /** Fetches a list of images about the user in which he is tagged. */

    init: function () {
      if (this.inited)
        return;
        
      var self = this;
      this.fbConnector.get('photos', function (response) {
        console.log('retrieving photos');
        $.each(response.data.slice(0, self.maxResults), function (number, photo) {
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
    addImageSlide: function (imageUrl) {
      var $image = $('<img>').attr('src', imageUrl),
          slide = this.createBaseSlide('image', $image, defaultDuration);
      this.slides.push(slide);
      this.emit('newSlides');
    },
  });

  return FBProfilePhotosGenerator;
});
