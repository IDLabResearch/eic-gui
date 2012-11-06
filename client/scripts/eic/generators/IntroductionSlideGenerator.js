define([ 'lib/jquery',
    'eic/generators/CombinedSlideGenerator',
    'eic/generators/TitleSlideGenerator',
    'eic/generators/FBProfilePhotosGenerator',
    'eic/generators/GoogleImageSlideGenerator',
    'eic/generators/GoogleMapsSlideGenerator',
    'eic/TTSService'],
function ($, CombinedSlideGenerator, TitleSlideGenerator, FBProfilePhotosGenerator,
          GoogleImageSlideGenerator, GoogleMapsSlideGenerator, TTSService) {
  "use strict";

  /*
   * CLEANUP
   * Male/female does not work
   **/

  /** Generator that creates introductory slides */
  function IntroductionSlideGenerator(profile, likedTopic) {
    if (profile.type !== 'facebook')
      throw "The IntroductionSlideGenerator only works with Facebook profiles.";

    CombinedSlideGenerator.call(this);
    this.slides = [];
    this.profile = profile;
    this.likedTopic = likedTopic;
  }

  $.extend(IntroductionSlideGenerator.prototype,
           CombinedSlideGenerator.prototype,
  {
      init: function () {
        if (!this.inited) {
          var self = this;
          this.fetchTopicInformation(function () {
            self.createSpeech();
            self.createIntroSlideGenerators();

          });
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

      fetchTopicInformation: function (callback) {
        var self = this,
            profile = this.profile,
            male = this.profile.gender === 'male';
        profile.personalPronoun = male ? 'he' : 'she';
        profile.possessivePronoun = male  ? 'his' : 'her';
        profile.fullHometown = profile.hometown.name;
        profile.shortHometown = profile.fullHometown.replace(/,.+$/, '');
        callback.call(self);
      },

      createIntroSlideGenerators: function () {
        this.addGenerators([
          new TitleSlideGenerator(this.profile.first_name + " Is Connected", 5000),
          new FBProfilePhotosGenerator(this.profile, 5),
        ]);
      },

      createSpeech: function () {
        var tts = new TTSService(),
            self = this;

        var text = "Once upon a time, " +
                   this.profile.first_name + " wondered how " +
                   this.profile.personalPronoun + " was connected to everything in this world. " +
                   "You see, according to " + this.profile.possessivePronoun + " Facebook page, " +
                   this.profile.first_name + " likes " + this.likedTopic.label + ".";

        tts.getSpeech(text, 'en_GB', function (response) {
          self.audioURL = response.snd_url;
        });
      },
    });

  return IntroductionSlideGenerator;
});
