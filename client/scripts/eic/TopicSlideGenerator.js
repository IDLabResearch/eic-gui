define(['lib/jquery'], function ($) {
  "use strict";

  function TopicSlideGenerator(topic) {
    this.topic = topic;
    this.slides = [];
  }

  TopicSlideGenerator.prototype = {
    hasNext: function () {
      return this.slides.length > 0;
    },

    init: function () {
      if(this.inited)
        return;
      var self = this;
      $.ajax('https://ajax.googleapis.com/ajax/services/search/images?v=1.0', {
        data: { q: this.topic, },
        dataType: 'jsonp',
      })
      .success(function (response) {
        response.responseData.results.forEach(function (result) {
          self.addImageSlide(result.url);
        });
      });
      this.inited = true;
    },

    next: function () {
      return this.slides.shift();
    },

    addImageSlide: function (imageUrl) {
      var $image = $('<img>').attr('src', imageUrl),
          $slide = $('<div>').addClass('slide image')
                             .append($image);
      this.slides.push($slide);
    },
  };

  return TopicSlideGenerator;
});
