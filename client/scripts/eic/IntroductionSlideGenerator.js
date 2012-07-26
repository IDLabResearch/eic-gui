define([ 'lib/jquery', 'eic/BaseSlideGenerator', 'eic/CombinedSlideGenerator', 'eic/TitleSlideGenerator', 'eic/GoogleImageSlideGenerator', 'eic/GoogleMapsSlideGenerator' ],
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
           CombinedSlideGenerator.prototype, {
      /** Initiates the introductory slides */
      init : function () {
        if (!this.inited) {

          var self = this;
          $.each(this.slides, function (index, slide) {
            if (slide.type == 'text') {
              // Create a text-slide with the
              // TitleSlideGenerator
              var titleSlideGenerator = new TitleSlideGenerator(slide.content);
              self.addGenerator(titleSlideGenerator);
            } else if (slide.type == 'image') {
              // Create an image-slide with the
              // GoogleImageSlideGenerator
              var googleImageSlideGenerator = new GoogleImageSlideGenerator(
                  slide.content, 1);
              self.addGenerator(googleImageSlideGenerator);
            } else if (slide.type == 'map') {
              // Create a map-slide with the GoogleMapsSlideGenerator
              var mapsSlideGenerator = new GoogleMapsSlideGenerator(slide.content);
              self.addGenerator(mapsSlideGenerator);
            }

            this.inited = true;
          });
        }
      },
    });

  return IntroductionSlideGenerator;
});