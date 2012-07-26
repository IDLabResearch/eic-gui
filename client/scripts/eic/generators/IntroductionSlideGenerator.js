define([ 'lib/jquery', 'eic/generators/BaseSlideGenerator',
    'eic/generators/CombinedSlideGenerator',
    'eic/generators/TitleSlideGenerator',
    'eic/generators/GoogleImageSlideGenerator',
    'eic/generators/GoogleMapsSlideGenerator' ], function ($,
    BaseSlideGenerator, CombinedSlideGenerator, TitleSlideGenerator,
    GoogleImageSlideGenerator, GoogleMapsSlideGenerator) {

  "use strict";

  /** Generator that creates introductory slides */
  function IntroductionSlideGenerator(startTopic) {
    CombinedSlideGenerator.call(this);
    this.slides = [];
    this.startTopic = startTopic;
  }

  $.extend(IntroductionSlideGenerator.prototype,
      CombinedSlideGenerator.prototype, {
      /** Initiates the introductory slides */
      init : function () {
        if (this.inited)
          return;
        /* Make all the slide contents for the introduction */
        var person = { name : this.startTopic.name,
        gender : (this.startTopic.gender == 'male') ? 'man' : 'woman',
        fullhometown : this.startTopic.hometown.name,
        hometown : this.startTopic.hometown.name.substr(0, this.startTopic.hometown.name.indexOf(',')),
        music : this.startTopic.music[0].name};
        this.slides = [
            { content : "Earth. Our home planet ...", type : "text" },
            { content : "earth", type : "image" },
            { content : "... It's filled with data and things ...", type : "text" },
            { content : "earth luminous network", type : "image" },
            { content : "... and EVERYTHING IS CONNECTED", type : "text" },
            { content : "Don't believe me? I will show you.", type : "text" },
            { content : "Once upon a time, " + person.name + " ...", type: "text"},
            { content : "... a " + person.gender + " from " + person.fullhometown + " ...", type : "text" },
            { content : person.fullhometown, type : "map" },
            { content : person.hometown, type : "image" },
            { content : "... liked " + person.music + " ...", type : "text" },
          ];

        /* Each slide type gets its own generator */
        var self = this;
        this.slides.forEach(function (slide) {
          var generator;
          switch (slide.type) {
          case "text":
            generator = new TitleSlideGenerator(slide.content);
            break;
          case "image":
            generator = new GoogleImageSlideGenerator(slide.content, 2);
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