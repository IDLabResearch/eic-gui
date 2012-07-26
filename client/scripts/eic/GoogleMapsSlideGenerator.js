define(['lib/jquery', 'eic/BaseSlideGenerator'],
function ($, BaseSlideGenerator) {
  "use strict";

  var defaultDuration = 5000;

  /** Generator that creates a title slide for a topic. */
  function GoogleMapsSlideGenerator(topic) {
    BaseSlideGenerator.call(this);
    
    if (typeof topic === "string")
      topic = { label: topic };
    
    this.topic = topic;
  }

  $.extend(GoogleMapsSlideGenerator.prototype,
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

      var $iframe = $('<iframe>')
                      .prop({ width: 800,
                              height: 600,
                              frameborder: 0,
                              scrolling: "no",
                              src: "https://maps.google.com/maps?" +
                                   "?t=h&z=12&output=embed&iwloc=near" +
                                   "&q=" + encodeURIComponent(this.topic.label) +
                                   "&hnear=" + encodeURIComponent(this.topic.label)
                             }),
          slide = this.createBaseSlide('map', $iframe, defaultDuration);
      
      this.done = true;

      return slide;
    },
  });
  
  
  return GoogleMapsSlideGenerator;
});
