define(['lib/jquery', 'eic/BaseSlideGenerator'],
function ($, BaseSlideGenerator) {
  "use strict";

  var defaultDuration = 1000;

  /** Generator that creates a title slide for a topic. */
  function TitleSlideGenerator(topic) {
    BaseSlideGenerator.call(this);
    
    if (typeof topic === "string")
      topic = { label: topic };
    
    this.topic = topic;
  }

  $.extend(TitleSlideGenerator.prototype,
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
          slide = this.createBaseSlide('title', $title, defaultDuration);
      
      this.done = true;

      return slide;
    },
  });
  
  
  return TitleSlideGenerator;
});
