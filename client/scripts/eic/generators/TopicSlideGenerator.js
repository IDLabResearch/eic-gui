/*!
 * EIC TopicSlideGenerator
 * 
 * This class creates all slides for a perticular topic. It's responsible of the sound attachment.
 * 
 * Copyright 2012, Multimedia Lab - Ghent University - iMinds
 * Licensed under GPL Version 3 license <http://www.gnu.org/licenses/gpl.html> .
 */
define(['lib/jquery', 'eic/Logger', 'eic/TTSService',
  'eic/generators/CompositeSlideGenerator', 'eic/generators/GoogleImageSlideGenerator',
  'eic/generators/GoogleMapsSlideGenerator', 'eic/generators/DateSlideGenerator',
  'eic/generators/TitleSlideGenerator', 'eic/generators/YouTubeSlideGenerator'],
  function ($, Logger, TTSService,
    CompositeSlideGenerator, GoogleImageSlideGenerator,
    GoogleMapsSlideGenerator, DateSlideGenerator,
    TitleSlideGenerator, YouTubeSlideGenerator) {
    "use strict";
    var logger = new Logger("TopicSlideGenerator");

    /*
    * CLEANUP
    **/

    function TopicSlideGenerator(topic, description) {
      CompositeSlideGenerator.call(this);

      this.generators = [];
      this.topic = topic;
      this.description = description;
      this.first = true;
      this.durationLeft = 0;
      this.audioURL = '';
    }

    $.extend(TopicSlideGenerator.prototype,
             CompositeSlideGenerator.prototype,
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
          switch (this.topic.type) {
          case "date":
            this.addGenerator(new DateSlideGenerator(this.topic));
            break;
          case "http://dbpedia.org/ontology/PopulatedPlace":
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
            self.durationLeft = Math.floor(data.snd_time);
            self.audioURL = data.snd_url;
            logger.log('Received speech for topic', self.topic.label);
            // When speech is received, 'remind' the presenter that the slides are ready
            self.emit('newSlides');
          });
          logger.log('Getting speech for topic', this.topic.label);
          tts.getSpeech(this.description, 'en_GB');

          this.inited = true;
        },

        next: function () {
          var slide;

          if (this.first) {
            // make sure first slide is always a titleslide
            slide = new TitleSlideGenerator(this.topic).next();
            slide.audioURL = this.audioURL;

            // prepare other generators
            this.generators.forEach(function (g) { g.prepare(); });

            this.first = false;

            logger.log('Added first slide on ', this.topic.label);

          }
          else {
            // randomly pick a generator and select its next slide
            var generator;
            do {
              generator = this.generators[Math.floor(Math.random() * this.generators.length)];
            } while (!generator.hasNext());
            slide = generator.next();

            // shorten the slide if it would take too long
            if (slide.duration > this.durationLeft)
              slide.duration = Math.min(slide.duration, this.durationLeft + 1000);
            // if no more slides are left, this one is allotted the remaining duration
            else if (this.generators.length <= 1 && !this.hasNext())
              slide.duration = this.durationLeft;
          }

          this.durationLeft -= slide.duration;
          logger.log('New slide: duration ', slide.duration, 'ms,', this.durationLeft, 'ms left');

          return slide;
        },
      });
    return TopicSlideGenerator;
  });


