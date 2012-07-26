define([ 'lib/jquery', 'eic/generators/BaseSlideGenerator',
    'eic/generators/CombinedSlideGenerator',
    'eic/generators/TitleSlideGenerator',
    'eic/generators/GoogleImageSlideGenerator',
    'eic/generators/GoogleMapsSlideGenerator',
    'eic/FacebookConnector'],
function ($,
    BaseSlideGenerator, CombinedSlideGenerator, TitleSlideGenerator,
    GoogleImageSlideGenerator, GoogleMapsSlideGenerator, FacebookConnector) {

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
        
        var person = {
          name : this.startTopic.name,
          gender : (this.startTopic.gender == 'male') ? 'man' : 'woman',
          fullhometown : this.startTopic.hometown.name,
          hometown : this.startTopic.hometown.name.substr(0, this.startTopic.hometown.name.indexOf(','))
        };
        
        /* Make all the slide contents for the introduction */
        this.addGenerator(new TitleSlideGenerator("Earth. Our home planet ..."));
        this.addGenerator(new GoogleImageSlideGenerator("earth", 2));
        this.addGenerator(new TitleSlideGenerator("... It's filled with data and things ..."));
        this.addGenerator(new GoogleImageSlideGenerator("earth luminous network", 2));
        this.addGenerator(new TitleSlideGenerator("... and EVERYTHING IS CONNECTED"));
        this.addGenerator(new TitleSlideGenerator("Don't believe me? I will show you."));
        this.addGenerator(new TitleSlideGenerator("Once upon a time, " + person.name + " ..."));
        this.addGenerator(new TitleSlideGenerator("... a " + person.gender +
                                                  " from " + person.fullhometown + " ..."));
        this.addGenerator(new GoogleMapsSlideGenerator(person.fullhometown));
        this.addGenerator(new GoogleImageSlideGenerator(person.hometown));
        
        var self = this;
        new FacebookConnector().get('music', function (response) {
          var music = response.data[0].name;
          self.addGenerator(new TitleSlideGenerator("... liked " + music + " ..."));
        });

        this.inited = true;
      },
    });

  return IntroductionSlideGenerator;
});