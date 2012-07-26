define(['lib/jquery', 'eic/CombinedSlideGenerator', 'eic/GoogleImageSlideGenerator', 'eic/TitleSlideGenerator', 'eic/VideoSlideGenerator'],
  function ($, CombinedSlideGenerator, GoogleImageSlideGenerator, TitleSlideGenerator, VideoSlideGenerator) {
    "use strict";

    function TopicSlideGenerator(topic, text) {
      //Create all generators
      var generators = [
      new GoogleImageSlideGenerator(topic),
      new TitleSlideGenerator(topic),
      //new VideoSlideGenerator(videoUrl)
      ];
      
      CombinedSlideGenerator.call(generators);
      
      this.topic = topic;
      this.text = text;
      this.slideNr = 0;
    }

    $.extend(TopicSlideGenerator.prototype,
      CombinedSlideGenerator.prototype,
      {
        next: function () {
          var i = Math.floor(Math.random() * this.generators.length),
            slide;

          while (!this.generators[i].hasNext()) {
            i = Math.floor(Math.random() * this.generators.length);
          }

          slide = this.generators[i].next();

          if (this.slideNr === 0) {
            slide.text = this.text;
          }

          this.slideNr += 1;
          return slide;
        },
        setBound: function (nrOfSlides) {
          var slides = [];
          for (var i = 0; i < generators.length; i++) {
            while (generators[i].hasNext())
              this.slides.push(this.generator.next());
          }
        }

      });
    return NarratedSlideGenerator;
  });


