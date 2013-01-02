define(['lib/jquery', 'eic/FacebookConnector',
  'eic/generators/IntroductionSlideGenerator', 'eic/generators/OutroductionSlideGenerator',
  'eic/generators/TopicToTopicSlideGenerator', 'eic/generators/CombinedSlideGenerator',
  'eic/generators/ErrorSlideGenerator',
  'eic/SlidePresenter', 'eic/TopicSelector'],
  function ($, FacebookConnector,
    IntroductionSlideGenerator, OutroductionSlideGenerator,
    TopicToTopicSlideGenerator, CombinedSlideGenerator,
    ErrorSlideGenerator, SlidePresenter, TopicSelector) {
    "use strict";

    function PresentationController() {
      this.facebookConnector = new FacebookConnector();
      this.topicSelector = new TopicSelector(this.facebookConnector);
      this.generator = new CombinedSlideGenerator();
    }

    PresentationController.prototype = {
      init: function () {
        var self = this;
        this.facebookConnector.init();

        // Select the topic when the user connects to Facebook
        // and prepare the introduction slide.
        this.facebookConnector.on('connected', function (event, profile) {
          self.profile = profile;
          self.topicSelector.selectTopic().then(
            function (startTopic) {
              self.startTopic = startTopic;
              self.intro = new IntroductionSlideGenerator(startTopic, profile);
              // Start initializing right away, avoiding delay when starting the movie
              self.intro.init();
            },
            function (error) {
              self.intro = new ErrorSlideGenerator(error);
              self.startTopic = error;
            });
        });
        this.facebookConnector.on('disconnected', function () {
          delete self.intro;
          delete self.startTopic;
        });
      },

      // Lets the user connect with a Facebook account.
      connectToFacebook: function () {
        this.facebookConnector.connect();
      },

      // Starts the movie about the connection between the user and the topic.
      playMovie: function () {
        if (!this.startTopic) throw "No start topic selected.";
        if (!this.endTopic) throw "No end topic selected.";

        // Create the slides panel
        var $slides = $('<div>').addClass('slides'),
        $audio = $('<div>').addClass('audio'),
        $wrapper = $('<div>').addClass('slides-wrapper')
                             .append($slides).append($audio);

        // Hide the main panel and show the slides panel.
        $('#screen').append($wrapper);
        $wrapper.hide().fadeIn($.proxy($slides.hide(), 'fadeIn', 1000));

        // Create the introduction if it does not exist yet
        if (!this.intro)
          this.intro = new IntroductionSlideGenerator(this.startTopic);

        // Add introduction, body, and outroduction generators
        this.generator.addGenerators([
          this.intro,
          new TopicToTopicSlideGenerator(this.startTopic, this.endTopic),
          new OutroductionSlideGenerator(this.profile || this.startTopic, this.endTopic)
        ]);

        // Start the slide show.
        new SlidePresenter($slides, this.generator, $audio).start();
      }
    };

    return PresentationController;
  });
