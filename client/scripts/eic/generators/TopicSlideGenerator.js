define(['lib/jquery',
  'eic/TTSService',
  'eic/generators/BaseSlideGenerator',
  'eic/generators/GoogleImageSlideGenerator',
  'eic/generators/TitleSlideGenerator',
  'eic/generators/VideoSlideGenerator'],
  function ($, TTSService, BaseSlideGenerator, GoogleImageSlideGenerator, TitleSlideGenerator, VideoSlideGenerator) {
    "use strict";

    function TopicSlideGenerator(topic, description) {
      BaseSlideGenerator.call(this);
      this.emitNewSlidesEvent = $.proxy(function () {
        this.emit('newSlides');
      }, this);

      //Create all generators
      var generators = [
        //TitleSlideGenerator always first in the array!
        new TitleSlideGenerator(topic),
        new GoogleImageSlideGenerator(topic),
        //new VideoSlideGenerator(videoUrl)
      ];

      this.generators = [];
      if (generators) {
        for (var i = 0; i < generators.length; i++)
          this.addGenerator(generators[i], true);
      }

      this.topic = topic;
      this.description = description;
      this.first = true;
      this.slideCount = 0;
      this.maxSlideCount = 0;
      this.maxDuration = 0;
      this.audioURL = '';
    }

    $.extend(TopicSlideGenerator.prototype,
      BaseSlideGenerator.prototype,
      {
        /** Checks whether at least one child generator has a next slide. */
        hasNext: function () {
          //if the sound url is not yet retrieved and attached to the first slide (maxDuration still 0), don't give any slides
          if (this.maxDuration === 0)
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
            self.maxDuration = data.snd_time;
            self.audioURL = data.snd_url;
            //When speech is received, 'remind' the presenter that the slides are ready
            self.emitNewSlidesEvent();
            
            console.log('Audio URL was fetched!');
          });
          tts.getSpeech(this.description, 'en_GB');
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
            this.first = false;
            
            console.log('First slide added!');
          } else
            slide = this.generators[i].next();
          
          slide.duration = this.maxDuration / 5;
          this.slideCount++;
          
          console.log('Slide' + this.slideCount + 'requested!');
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
            this.slideCount += 1;
            
            if (this.nrOfSlides > this.maxSlideCount && this.maxSlideCount > 0) {
              this.generators.length = 0;
            }
            self.emitNewSlidesEvent();
          });
    
          if (generator.hasNext())
            this.emitNewSlidesEvent();
        },
      });
    return TopicSlideGenerator;
  });


