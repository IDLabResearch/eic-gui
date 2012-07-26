define(['lib/jquery',
        'eic/generators/CombinedSlideGenerator',
        'eic/generators/IntroductionSlideGenerator',
        'eic/generators/TopicSlideGenerator'],
function ($, CombinedSlideGenerator, IntroductionSlideGenerator, TopicSlideGenerator) {
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
      CombinedSlideGenerator.prototype.init.call(this);
      this.addGenerator(new IntroductionSlideGenerator(this.startTopic));

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
      });
    }
  });
  
  
  return TopicToTopicSlideGenerator;
});
