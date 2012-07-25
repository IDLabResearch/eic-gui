define(['lib/jquery', 'eic/BaseSlideGenerator'],
function ($, BaseSlideGenerator) {
  "use strict";

  var defaultDuration = 1000;

  /** Generator of images slides from Google Image search results.
   * Parameters: a topic and the maximum number of results to return
   */
  function GoogleImageSlideGenerator(topic, maxResults) {
    BaseSlideGenerator.call(this);
    this.topic = topic;
    this.maxResults = maxResults || 4;
    this.slides = [];
  }

  $.extend(GoogleImageSlideGenerator.prototype,
           BaseSlideGenerator.prototype,
  {
    /** Checks whether any slides are left. */
    hasNext: function () {
      return this.slides.length > 0;
    },

    /** Fetches a list of images about the topic. */
    init: function () {
      if (this.inited)
        return;
      var self = this;
      $.ajax('https://ajax.googleapis.com/ajax/services/search/images?v=1.0', {
        data: {
          q: this.topic,
          imgsz: 'xxlarge',
          rsz: this.maxResults,
        },
        dataType: 'jsonp',
      })
      .success(function (response) {
        response.responseData.results.forEach(function (result) {
          self.addImageSlide(result.url);
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

  return GoogleImageSlideGenerator;
});
