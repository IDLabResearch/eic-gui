define(['lib/jquery',
  'eic/TTSService',
  'eic/generators/CombinedSlideGenerator',
  'eic/generators/GoogleImageSlideGenerator',
  'eic/generators/GoogleMapsSlideGenerator',
  'eic/generators/DateSlideGenerator',
  'eic/generators/TitleSlideGenerator',
  'eic/generators/YouTubeSlideGenerator'],
  function ($, TTSService, CombinedSlideGenerator, GoogleImageSlideGenerator, GoogleMapsSlideGenerator, DateSlideGenerator, TitleSlideGenerator, YouTubeSlideGenerator) {
    "use strict";

    function TopicSlideGenerator(topic, description) {
      CombinedSlideGenerator.call(this);
      this.emitNewSlidesEvent = $.proxy(this, 'emit', 'newSlides');

      this.generators = [];
      this.topic = topic;
      this.description = description;
      this.first = true;
      this.slideCount = 0;
      this.durationLeft = 0;
      this.audioURL = '';
    }

    $.extend(TopicSlideGenerator.prototype,
             CombinedSlideGenerator.prototype,
      {
        /** Checks whether at least one child generator has a next slide. */
        hasNext: function () {
          if (this.durationLeft <= 0)
            return false;
          else
            return this.generators.some(function (g) { return g.hasNext(); });
        },

        /** Initialize all child generators. */
        init: function () {
          if (this.inited)
            return;
            
          //Create all generators depending on the type of the topic
          this.addGenerator(new TitleSlideGenerator(this.topic));
          switch (this.topic.type) {
          case "date":
            this.addGenerator(new DateSlideGenerator(this.topic));
            break;
          case "location":
            this.addGenerator(new GoogleMapsSlideGenerator(this.topic));
            this.addGenerator(new GoogleImageSlideGenerator(this.topic));
            this.addGenerator(new YouTubeSlideGenerator(this.topic));
            break;
          default:
            this.addGenerator(new GoogleImageSlideGenerator(this.topic));
            this.addGenerator(new YouTubeSlideGenerator(this.topic));
            break;
          }
          
          var tts = new TTSService(),
              self = this;
          
          tts.once('speechReady', function (event, data) {
            self.durationLeft = data.snd_time;
            self.audioURL = data.snd_url;
            console.log("Speech for topic " + self.topic.label + " received!");
            //When speech is received, 'remind' the presenter that the slides are ready
            self.emitNewSlidesEvent();
          });
          tts.getSpeech(this.description, 'en_GB');
          console.log("Getting speech for topic " + this.topic.label + " from service");
          
          this.inited = true;
        },
        
        next: function () {
          var slide;
        
          if (this.first) {
            //make sure first slide is always a titleslide
            slide = this.generators[0].next();
            slide.audioURL = this.audioURL;
            this.first = false;
            
            console.log('First slide ' + this.topic.label + ' added!');
          }
          else {
            var generator;
            do {
              generator = this.generators[Math.floor(Math.random() * this.generators.length)];
            } while (!generator.hasNext());
            slide = generator.next();
            if (slide.duration > this.durationLeft)
              slide.duration = Math.min(slide.duration, this.durationLeft + 1000);
          }
          
          this.durationLeft -= slide.duration;
          
          console.log('New slide: duration ' + slide.duration + 'ms, ' +  this.durationLeft + 'ms left!');
          return slide;
        },
      });
    return TopicSlideGenerator;
  });


