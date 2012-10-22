define(['lib/jquery', 'eic/generators/BaseSlideGenerator'],
function ($, BaseSlideGenerator) {
  "use strict";
  
  /*
   * CLEANUP
   * Avoid images that don't exists
   **/

  var defaultDuration = 2500;
  var repeat = false;

  /** Generator of images slides from Google Image search results.
   * Parameters: a topic and the maximum number of results to return
   */
  function GoogleImageSlideGenerator(topic, maxResults) {
    BaseSlideGenerator.call(this);
    
    if (typeof topic === "string")
      topic = { label: topic };
    
    this.topic = topic;
    this.maxResults = maxResults || 4;
    this.slides = [];
    this.cnt = 0;
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
          q: this.topic.label,
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
      if (!repeat)
        return this.slides.shift();
        
      this.cnt += 1;
      return this.slides[(this.cnt - 1) % this.maxResults];
    },

    /** Adds a new image slide. */
    addImageSlide: function (imageUrl) {
      var $image = $('<img>').attr('src', imageUrl),
          $figure = $('<figure>').append($image),
          slide = this.createBaseSlide('image', $figure, defaultDuration);

      slide.on('started', function () { setTimeout($.proxy($image, 'addClass', 'zoom')); });
      this.slides.push(slide);
      this.emit('newSlides');
    },
  });

  return GoogleImageSlideGenerator;
});
