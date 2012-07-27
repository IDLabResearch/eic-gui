define([ 'lib/jquery',
    'eic/generators/CombinedSlideGenerator',
    'eic/generators/TitleSlideGenerator',
    'eic/TTSService'],
function ($, CombinedSlideGenerator, TitleSlideGenerator, TTSService) {

  "use strict";

  /** Generator that creates outtroductory slides */
  function OuttroductionSlideGenerator(startTopic, endTopic) {
    if (startTopic.type !== 'facebook')
      throw "The OuttroductionSlideGenerator only works with topics that are Facebook profiles.";
    
    CombinedSlideGenerator.call(this);
    this.slides = [];
    this.startTopic = startTopic;
    this.endTopic = endTopic;
  }

  $.extend(OuttroductionSlideGenerator.prototype,
           CombinedSlideGenerator.prototype,
  {
      init: function () {
        if (!this.inited) {
          var self = this;
          self.createSpeech();
          self.createOuttroSlideGenerators();
          this.inited = true;
        }
      },
      
      next: function () {
        var slide = CombinedSlideGenerator.prototype.next.apply(this);
        if (this.audioURL) {
          slide.audioURL = this.audioURL;
          delete this.audioURL;
        }
        return slide;
      },
      
      createOuttroSlideGenerators: function () {
        var startTopic = this.startTopic,
            endTopic = this.endTopic,
            self = this;
        
        [
          new TitleSlideGenerator("As you can see, ", 2000),
          new TitleSlideGenerator(startTopic.first_name + ", ", 1000),
          new TitleSlideGenerator("You are connected to everything in this world, ", 3000),
          new TitleSlideGenerator("Even " + endTopic.label + "!", 3000)
        ]
        .forEach(function (generator) {
          self.addGenerator(generator);
        });
      },
      
      createSpeech: function () {
        var startTopic = this.startTopic,
            endTopic = this.endTopic,
            tts = new TTSService(),
            self = this;
        
        var text = "As you can see, " +
                   startTopic.first_name + ", " +
                   "You are connected to everything in this world," +
                   "Even " + endTopic.label + "!";
        
        tts.getSpeech(text, 'en_GB', function (response) {
          self.audioURL = response.snd_url;
        });
      }
    });

  return OuttroductionSlideGenerator;
});
