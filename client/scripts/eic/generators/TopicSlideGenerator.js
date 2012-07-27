define(['lib/jquery',
  'eic/TTSService',
  'eic/generators/BaseSlideGenerator',
  'eic/generators/GoogleImageSlideGenerator',
  'eic/generators/GoogleMapsSlideGenerator',
  'eic/generators/DateSlideGenerator',
  'eic/generators/TitleSlideGenerator',
  'eic/generators/YouTubeSlideGenerator'],
  function ($, TTSService, BaseSlideGenerator, GoogleImageSlideGenerator, GoogleMapsSlideGenerator, DateSlideGenerator, TitleSlideGenerator, YouTubeSlideGenerator) {
    "use strict";

    function TopicSlideGenerator(topic, description) {
      BaseSlideGenerator.call(this);
      this.emitNewSlidesEvent = $.proxy(function () {
        this.emit('newSlides');
      }, this);

      this.generators = [];
      //Create all generators depending on the type of the topic
      this.addGenerator(new TitleSlideGenerator(topic), true);
      
      switch (topic.type) {
      case "date":
        this.addGenerator(new DateSlideGenerator(topic));
        break;
      case "location":
        this.addGenerator(new GoogleMapsSlideGenerator(topic));
        this.addGenerator(new GoogleImageSlideGenerator(topic), true);
        this.addGenerator(new YouTubeSlideGenerator(topic), true);
        break;
      default:
        this.addGenerator(new GoogleImageSlideGenerator(topic), true);
        this.addGenerator(new YouTubeSlideGenerator(topic), true);
        break;
      }


      //      if (generators) {
      //        for (var i = 0; i < generators.length; i++)
      //          this.addGenerator(generators[i], true);
      //      }

      this.topic = topic;
      this.description = description;
      this.first = true;
      this.slideCount = 0;
      this.durationLeft = 0;
      this.audioURL = '';
    }

    $.extend(TopicSlideGenerator.prototype,
      BaseSlideGenerator.prototype,
      {
        /** Checks whether at least one child generator has a next slide. */
        hasNext: function () {
          //if the sound url is not yet retrieved and attached to the first slide (maxDuration still 0), don't give any slides
          if (this.durationLeft <= 0)
            return false;
          
          return this.generators.some(function (g) {
            return g.hasNext();
          });
        },

        /** Initialize all child generators. */
        init: function () {
          var tts = new TTSService(), self = this;
          
          if (!this.inited) {
            this.generators.forEach(function (g) {
              g.init();
            });
            this.inited = true;
          }

          tts.once('speechReady', function (event, data) {
            self.durationLeft = data.snd_time;
            self.audioURL = data.snd_url;
            console.log("Speech for topic " + self.topic.label + " received!");
            //When speech is received, 'remind' the presenter that the slides are ready
            self.emitNewSlidesEvent();
          });
          tts.getSpeech(this.description, 'en_GB');
          console.log("Getting speech for topic " + this.topic.label + " from service");
        },
        
        next: function () {
          var i = 1 + Math.floor(Math.random() * (this.generators.length - 1)),
          slide;

          while (!this.generators[i].hasNext()) {
            i = 1 + Math.floor(Math.random() * (this.generators.length - 1));
          }
        
          if (this.first) {
            //make sure first slide is always a titleslide
            slide = this.generators[0].next();
            slide.audioURL = this.audioURL;
            slide.duration = this.generators[0].getDuration();
            this.first = false;
            
            console.log('First slide ' + this.topic.label + ' added!');
          } else {
            slide = this.generators[i].next();
            slide.duration = this.durationLeft < this.generators[i].getDuration() ? this.durationLeft + 1000 : this.generators[i].getDuration();
          }
          
          this.durationLeft -= slide.duration;
          
          console.log('New slide: duration ' + slide.duration + 'ms, ' +  this.durationLeft + 'ms left!');
          return slide;
        },
        /** Add a child generator add the end of the list. */
        addGenerator: function (generator, suppressInit) {
          var self = this;
          
          // initialize the generator and add it to the list
          if (!suppressInit)
            generator.init();
          this.generators.push(generator);

          // signal the arrival of new slides
          generator.on('newSlides', function () {
            self.emitNewSlidesEvent();
          });
    
          if (generator.hasNext())
            this.emitNewSlidesEvent();
        }
      });
    return TopicSlideGenerator;
  });


