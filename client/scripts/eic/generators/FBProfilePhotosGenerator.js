define(['lib/jquery', 'eic/generators/BaseSlideGenerator'],
function ($, BaseSlideGenerator) {
  "use strict";

  var defaultDuration = 1000;

  /** Generator of images slides from Facebook User Profile search results.
   * Parameters: a facebookconnector of a logged in fb user and no of maxResutls
   */
  function FBProfilePhotosGenerator(fbConnector, maxResults) {
    BaseSlideGenerator.call(this);
    this.fbConnector = fbConnector;
    if (typeof maxResults == 'undefined')
			this.maxResults = 5;
    else
			this.maxResults = maxResults;
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
        $.each(response.data.slice(0, self.maxResults), function (number, photo) {
          self.addImageSlide(photo.source);
        });
      });
      
      this.fbConnector.findPlacesNearMe(function (response) {
				$.each(response.data.slice(0, self.maxResults), function (number, place) {
          self.fbConnector.getPlace(place.id, function (response) {
						self.addImageSlide(response.picture);
          });
          
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
