define(['lib/jquery', 'eic/generators/BaseSlideGenerator'],
function ($, BaseSlideGenerator) {
  "use strict";

  var defaultDuration = 15000;

  /** Generator that creates a title slide for a topic. */
  function LoadingSlideGenerator(topic, duration) {
    BaseSlideGenerator.call(this);
    
    if (typeof topic === "string")
      topic = { label: topic };
    
    this.topic = topic;
    this.duration = duration || defaultDuration;
  }

  $.extend(LoadingSlideGenerator.prototype,
    BaseSlideGenerator.prototype,
  {
    /** Checks whether the title slide has been shown. */
    hasNext: function () {
      return this.done !== true;
    },

    /** Advances to the title slide. */
    next: function () {
      if (!this.hasNext())
        return;

      var $title = $('<h1>').text(this.topic.label),
          slide = this.createBaseSlide('title', $title, this.duration);
      
      this.done = true;

      return slide;
    },
  });
  
  return LoadingSlideGenerator;
});
