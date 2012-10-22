define(['lib/jquery',
  'eic/generators/CombinedSlideGenerator',
  'eic/generators/LoadingSlideGenerator',
  'eic/generators/IntroductionSlideGenerator',
  'eic/generators/TopicSlideGenerator',
  'eic/generators/OutroductionSlideGenerator',
  'eic/Summarizer'
  ],
  function ($, CombinedSlideGenerator, LoadingSlideGenerator, IntroductionSlideGenerator, TopicSlideGenerator, OutroductionSlideGenerator, Summarizer) {
    "use strict";
    
    /*
    * CLEANUP
    **/

    var defaultDuration = 1000;

    function TopicToTopicSlideGenerator(startTopic, endTopic) {
      CombinedSlideGenerator.call(this);
      this.startTopic = startTopic;
      this.endTopic = endTopic;
    }

    $.extend(TopicToTopicSlideGenerator.prototype,
      CombinedSlideGenerator.prototype,
      {
        init: function () {
          if (this.startTopic) {
            if (!this.initedStart) {
              CombinedSlideGenerator.prototype.init.call(this);
              this.addGenerator(new IntroductionSlideGenerator(this.startTopic));
              this.addGenerator(this.loader = new LoadingSlideGenerator());
              this.initedStart = true;
            }

            if (this.endTopic && !this.initedEnd) {
              var self = this;
              $.ajax({
                type: "GET",
                url: "http://pathfinding.restdesc.org/findPath",
                dataType: "JSON",
                data: {
                  s1: this.startTopic.selectedUri,
                  s2: this.endTopic.uri
                },
                error: function () {
                  //Error fallback...
                },
                success: function (path) {
                  console.log('Path received!');
                  var summ = new Summarizer();
                  $(summ).one('generated', function (event, story) {
                    story.steps.forEach(function (step) {
                      self.addGenerator(new TopicSlideGenerator(step.topic, step.text));
                    });
                    self.addGenerator(new OutroductionSlideGenerator(self.startTopic, self.endTopic));
                  });
                  summ.summarize(path);

                  // give the generators some time to load and stop waiting
                  setTimeout(function () {
                    self.loader.stopWaiting();
                  }, 5000);
                }
              });
              this.initedEnd = true;
            }
          }
        },
    
        setStartTopic: function (startTopic) {
          if (this.startTopic)
            throw "startTopic already set";
          this.startTopic = startTopic;
          this.init();
        },
    
        setEndTopic: function (endTopic) {
          if (this.endTopic)
            throw "endTopic already set";
          this.endTopic = endTopic;
          this.init();
        }
      });
  
  
    return TopicToTopicSlideGenerator;
  });
