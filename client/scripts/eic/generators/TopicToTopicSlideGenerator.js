define(['lib/jquery',
        'eic/generators/CombinedSlideGenerator',
        'eic/generators/IntroductionSlideGenerator',
        'eic/generators/TopicSlideGenerator',
        'eic/generators/OutroductionSlideGenerator'],
function ($, CombinedSlideGenerator, IntroductionSlideGenerator, TopicSlideGenerator, OutroductionSlideGenerator) {
  "use strict";

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
          this.initedStart = true;
        }

        if (this.endTopic && !this.initedEnd) {
          var self = this;
          $.ajax({
            type: "POST",
            url: "/stories",
            dataType: "JSON",
            data: {
              startTopic: this.startTopic,
              endTopic: this.endTopic
            }
          }).success(function (story) {
            story.steps.forEach(function (step) {
              self.addGenerator(new TopicSlideGenerator(step.topic, step.text));
            });
            self.addGenerator(new OutroductionSlideGenerator(self.startTopic,self.endTopic));
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
