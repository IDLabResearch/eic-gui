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

    /** Generator that creates introductory slides */
    function IntroductionSlideGenerator(startTopic, profile) {
      if (!startTopic)
        throw "The IntroductionSlideGenerator has no starttopic";

      CombinedSlideGenerator.call(this);
      this.slides = [];
      this.profile = profile;
      this.startTopic = startTopic;
    }

    $.extend(IntroductionSlideGenerator.prototype,
      CombinedSlideGenerator.prototype,
      {
        init: function () {
          if (!this.inited) {
            var self = this;
            if (this.profile)
              this.fetchTopicInformation(function () {
                self.createSpeech();
                self.createIntroSlideGenerators();
              });
            else {
              this.createSpeech();
              this.createIntroSlideGenerators();
            }
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
          var generators = [new TitleSlideGenerator((this.profile ? this.profile.first_name : this.startTopic.label)+ " Is Connected", (this.profile ? 5000 : 8000))]
          if (this.profile)
            generators.push(new FBProfilePhotosGenerator(this.profile, 5));
          this.addGenerators(generators);
        },

        createSpeech: function () {
          var tts = new TTSService(),
          self = this;

          var text = "Once upon a time, " +
          (this.profile ? this.profile.first_name : 'you') + " wondered how " +
          (this.profile ? this.profile.personalPronoun : this.startTopic.label) + " was connected to everything in this world. ";

          if (this.profile)
            text += "You see, according to " + this.profile.possessivePronoun + " Facebook page, " +
            this.profile.first_name + " likes " + this.startTopic.label + ".";

          tts.getSpeech(text, 'en_GB', function (response) {
            self.audioURL = response.snd_url;
          });
        },
      });

    return IntroductionSlideGenerator;
  });
