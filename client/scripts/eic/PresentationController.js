define(['lib/jquery', 'eic/AutocompleteTopic', 'eic/DrawPiece', 'eic/FacebookConnector',
  'eic/generators/IntroductionSlideGenerator', 'eic/generators/OutroductionSlideGenerator',
  'eic/generators/TopicToTopicSlideGenerator', 'eic/generators/CombinedSlideGenerator',
  'eic/generators/ErrorSlideGenerator',
  'eic/SlidePresenter', 'eic/TopicSelector'],
  function ($, autocompleteTopic, drawPiece, FacebookConnector,
    IntroductionSlideGenerator, OutroductionSlideGenerator,
    TopicToTopicSlideGenerator, CombinedSlideGenerator,
    ErrorSlideGenerator,
    SlidePresenter, TopicSelector) {
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
              self.intro = new IntroductionSlideGenerator(startTopic, profile);
              self.intro.init();
              self.startTopic = startTopic;
            },
            function (error) {
              self.intro = new ErrorSlideGenerator(error);
              self.intro.init();
              self.startTopic = null;
            });
        });
      },

      // Lets the user connect with a Facebook account.
      connectToFacebook: function () {
        this.facebookConnector.connect();
      },

      // Starts the movie about the connection between the user and the topic.
      playMovie: function () {
        var $slides = $('<div>').addClass('slides'),
        $audio = $('<div>').addClass('audio'),
        $wrapper = $('<div>').addClass('slides-wrapper')
        .append($slides).append($audio);

        // Hide the main panel.
        $('#screen').append($wrapper);

        // Show the slides panel.
        $slides.hide();
        $wrapper.hide().fadeIn($.proxy($slides, 'fadeIn', 1000));

        if (this.intro)
          this.generator.addGenerator(this.intro);
        else {
          this.intro = new IntroductionSlideGenerator(this.startTopic);
          this.intro.init();
          this.generator.addGenerator(this.intro);
        }

        this.topicToTopic = new TopicToTopicSlideGenerator(this.startTopic);
        this.generator.addGenerator(this.topicToTopic);
        this.topicToTopic.setEndTopic(this.endTopic);

        this.generator.addGenerator(new OutroductionSlideGenerator(this.profile || this.startTopic, this.endTopic));

        // Start the slide show.
        var presenter = new SlidePresenter($slides, this.generator, $audio);
        presenter.start();
      }
    };

    return PresentationController;
  });
