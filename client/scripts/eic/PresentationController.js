define(['lib/jquery', 'eic/FacebookConnector',
  'eic/generators/IntroductionSlideGenerator', 'eic/generators/OutroductionSlideGenerator',
  'eic/generators/TopicToTopicSlideGenerator', 'eic/generators/CombinedSlideGenerator',
  'eic/generators/ErrorSlideGenerator', 'eic/SlidePresenter', 'eic/TopicSelector'],
  function ($, FacebookConnector,
    IntroductionSlideGenerator, OutroductionSlideGenerator,
    TopicToTopicSlideGenerator, CombinedSlideGenerator,
    ErrorSlideGenerator, SlidePresenter, TopicSelector) {
    "use strict";

    function PresentationController() {
      this.facebookConnector = new FacebookConnector();
      this.topicSelector = new TopicSelector(this.facebookConnector);
    }

    /* Member functions */

    PresentationController.prototype = {
      init: function () {
        var self = this;
        this.facebookConnector.init();

        // Select the topic when the user connects to Facebook
        // and prepare the introduction slide.
        this.facebookConnector.on('connected', function (event, profile) {
          self.profile = profile;
          self.topicSelector.selectTopic().then(
            function (startTopic) { self.startTopic = startTopic; },
            function (error) { self.startTopic = new Error(error); });
        });
        this.facebookConnector.on('disconnected', function () {
          delete self.profile;
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
        if (!this.intro) throw "The introduction was not initialized";

        // Create the slides panel
        var $slides = $('<div>').addClass('slides'),
            $audio = $('<div>').addClass('audio'),
            $wrapper = $('<div>').addClass('slides-wrapper')
                                 .append($slides).append($audio);

        // Hide the main panel and show the slides panel
        $('#screen').append($wrapper);
        $wrapper.hide().fadeIn($.proxy($slides.hide(), 'fadeIn', 1000));

        // Add introduction, body, and outroduction generators
        var generator = new CombinedSlideGenerator();
        generator.addGenerators([
          this.intro, // created by setting the startTopic property
          new TopicToTopicSlideGenerator(this.startTopic, this.endTopic),
          new OutroductionSlideGenerator(this.profile || this.startTopic, this.endTopic)
        ]);

        // Start the slide show.
        new SlidePresenter($slides, generator, $audio).start();
      }
    };

    /* Properties */

    // The startTopic property also initializes the introduction,
    // so the movie can be buffered earlier and thus start faster.
    Object.defineProperty(PresentationController.prototype, "startTopic", {
      get: function () { return this._startTopic; },
      set: function (startTopic) {
        this._startTopic = startTopic;
        delete this.intro;

        // If the topic is an error, show the error slide
        if (startTopic instanceof Error)
          this.intro = new ErrorSlideGenerator(startTopic);
        // Otherwise, create an actual introduction slide
        else
          this.intro = new IntroductionSlideGenerator(startTopic, this.profile);
        // Initialize the intro right away, avoiding delay when starting the movie
        this.intro.init();
      }
    });

    return PresentationController;
  });
