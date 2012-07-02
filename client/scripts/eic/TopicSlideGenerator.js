define(['lib/jquery'], function ($) {
  "use strict";

  /** Generator for images slides on a specified topic. */
  function TopicSlideGenerator(topic) {
    this.topic = topic;
    this.slides = [];
  }

  TopicSlideGenerator.prototype = {
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
          $slide = $('<div>').addClass('slide image')
                             .append($image);
      this.slides.push($slide);
    },
  };

  return TopicSlideGenerator;
});
