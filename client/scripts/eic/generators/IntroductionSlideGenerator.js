define([ 'lib/jquery',
  'eic/generators/BaseSlideGenerator',
  'eic/generators/CombinedSlideGenerator',
  'eic/generators/TitleSlideGenerator',
  'eic/generators/GoogleImageSlideGenerator',
  'eic/generators/GoogleMapsSlideGenerator' ],
    function ($,
    BaseSlideGenerator, CombinedSlideGenerator, TitleSlideGenerator,
    GoogleImageSlideGenerator, GoogleMapsSlideGenerator) {

  "use strict";

  /** Generator that creates introductory slides */
  function IntroductionSlideGenerator(startTopic) {
    CombinedSlideGenerator.call(this);
    this.slides = [ { content : "Earth. Our home planet ...",
    type : "text" }, { content : "earth",
    type : "image" }, { content : "... It's filled with data and things ...",
    type : "text" }, { content : "earth luminous network",
    type : "image" }, { content : "... and EVERYTHING IS CONNECTED.",
    type : "text" }, { content : "Don't believe us? Just wait and see...",
    type : "text" }, { content : "Ghent, Belgium",
    type : "map" } ];
    this.startTopic = startTopic;
  }

  $.extend(IntroductionSlideGenerator.prototype,
           CombinedSlideGenerator.prototype,
  {
      /** Initiates the introductory slides */
      init : function () {
        if (this.inited)
          return;

        var self = this;
        this.slides.forEach(function (slide) {
          var generator;
          switch (slide.type) {
          case "text":
            generator = new TitleSlideGenerator(slide.content);
            break;
          case "image":
            generator = new GoogleImageSlideGenerator(slide.content, 1);
            break;
          case "map":
            generator = new GoogleMapsSlideGenerator(slide.content);
            break;
          }
          self.addGenerator(generator);
        });
        
        this.inited = true;
      },
    });

  return IntroductionSlideGenerator;
});