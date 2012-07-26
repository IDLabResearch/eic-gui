define(['lib/jquery', 'eic/BaseSlideGenerator', 'eic/GoogleImageSlideGenerator', 'eic/TitleSlideGenerator', 'eic/VideoSlideGenerator'],
  function ($, BaseSlideGenerator, GoogleImageSlideGenerator, TitleSlideGenerator, VideoSlideGenerator) {
    "use strict";

    function TopicSlideGenerator(topic, description) {
      BaseSlideGenerator.call(this);
      this.emitNewSlidesEvent = $.proxy(function () { 
        this.emit('newSlides');
      }, this);

      //Create all generators
      var generators = [
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
      this.first = false;
      this.slideCount = 0;
      this.maxSlideCount = 0;
    }

    $.extend(TopicSlideGenerator.prototype,
      BaseSlideGenerator.prototype,
      {
        /** Checks whether at least one child generator has a next slide. */
        hasNext: function () {
          return this.generators.some(function (g) {
            return g.hasNext();
          });
        },

        /** Initialize all child generators. */
        init: function () {
          if (!this.inited) {
            this.generators.forEach(function (g) {
              g.init();
            });
            this.inited = true;
          }
        },
        
        next: function () {
          var i = 1+Math.floor(Math.random() * (this.generators.length-1)),
          slide;

          while (!this.generators[i].hasNext()) {
            i = Math.floor(Math.random() * this.generators.length);
          }

          slide = this.generators[i].next();

          if (this.first) {
            slide.description = this.description;
            this.first = false;
          }

          return slide;
        },
        /** Checks if the generator can stop generating slides based on a required nr **/
        setBound: function (nrOfSlides) {
          this.maxSlideCount = nrOfSlides;
          
          if (this.nrOfSlides > this.maxSlideCount && this.maxSlideCount > 0) {
            this.generators.length = 0;
          }
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


