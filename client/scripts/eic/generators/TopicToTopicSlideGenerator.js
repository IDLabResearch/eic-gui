define(['lib/jquery',
  'eic/generators/CombinedSlideGenerator',
  'eic/generators/LoadingSlideGenerator',
  'eic/generators/TopicSlideGenerator',
  'eic/Summarizer'
  ],
  function ($, CombinedSlideGenerator, LoadingSlideGenerator, TopicSlideGenerator, Summarizer) {
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
              this.addGenerator(this.loader = new LoadingSlideGenerator());
              this.initedStart = true;
            }

            if (this.endTopic && !this.initedEnd) {
              var self = this;
              $.ajax({
                type: "GET",
                url: "http://pathfinding.restdesc.org/paths",
                dataType: "JSON",
                data: {
                  from: this.startTopic.uri,
                  to: this.endTopic.uri
                },
                error: function () {
                  // To do: error fallback
                },
                success: function (path) {
                  var summ = new Summarizer();
                  $(summ).one('generated', function (event, story) {
                    story.steps.forEach(function (step) {
                      self.addGenerator(new TopicSlideGenerator(step.topic, step.text));
                    });
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
