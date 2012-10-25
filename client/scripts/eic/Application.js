define(['lib/jquery', 'eic/AutocompleteTopic', 'eic/FacebookConnector',
        'eic/generators/IntroductionSlideGenerator', 'eic/generators/OutroductionSlideGenerator',
        'eic/generators/TopicToTopicSlideGenerator', 'eic/generators/CombinedSlideGenerator',
        'eic/SlidePresenter', 'eic/TopicSelector'],
function ($, autocompleteTopic, FacebookConnector,
          IntroductionSlideGenerator, OutroductionSlideGenerator,
          TopicToTopicSlideGenerator, CombinedSlideGenerator,
          SlidePresenter, TopicSelector) {
  "use strict";
  
  /*
   * CLEANUP
   **/

  // The main "Everything Is Connected" application.
  function Application() {
    this.facebookConnector = new FacebookConnector();
    this.topicSelector = new TopicSelector(this.facebookConnector);
    this.generator = new CombinedSlideGenerator();
  }

  Application.prototype = {
    // Initializes the application.
    init: function () {
      var self = this;
      this.initControls();
      this.facebookConnector.init();

      // Select the topic when the user connects to Facebook
      this.facebookConnector.once('connected', function (event, profile) {
        self.profile = profile;
        self.topicSelector.selectTopic(function (startTopic) {
          // add introduction generator
          self.generator.addGenerator(new IntroductionSlideGenerator(profile, startTopic));

          // add topic-to-topic generator
          self.topicToTopic = new TopicToTopicSlideGenerator(startTopic);
          self.generator.addGenerator(self.topicToTopic);
        });
      });
    },

    // Lets the user connect with a Facebook account.
    connectToFacebook: function () {
      $('#facebook').text('Connecting…');
      this.facebookConnector.connect();
    },

    // Updates the goal topic.
    updateTopic: function () {
      this.endTopic = {
        label: $('#topic').val(),
        uri: $('#topic').data('uri') || ''
      };
      var valid = this.endTopic.uri.length > 0;

      // Enable third step if the topic is valid.
      $('.step.three')[valid ? 'removeClass' : 'addClass']('inactive');
      $('#play').prop('disabled', !valid);
    },

    // Starts the movie about the connection between the user and the topic.
    playMovie: function () {
      var $slides = $('<div>').addClass('slides'),
          $audio = $('<div>').addClass('audio'),
          $wrapper = $('<div>').addClass('slides-wrapper')
                               .append($slides).append($audio);

      // Hide the main panel.
      $('#main').slideUp();
      $('body').append($wrapper);

      // Show the slides panel.
      $slides.hide();
      $wrapper.hide().fadeIn($.proxy($slides, 'fadeIn', 1000));

      // Fix the end topic and create final generators for the slide show
      this.topicToTopic.setEndTopic(this.endTopic);
      this.generator.addGenerator(new OutroductionSlideGenerator(this.profile, this.endTopic));

      // Start the slide show.
      var presenter = new SlidePresenter($slides, this.generator, $audio);
      presenter.start();
    },

    // Initialize the HTML controls (bind events, set up autocomplete, ...).
    initControls: function () {
      // Initialize the controls of each step.
      $('#facebook-connect').click($.proxy(this, 'connectToFacebook'));
      $('#topic').on('change keyup', $.proxy(this, 'updateTopic'));
      $('#play').click($.proxy(this, 'playMovie'));

      // Make sure the topic is empty (browsers can cache text).
      $('#topic').val('');

			autocompleteTopic('#topic');

      // Don't let empty links trigger a location change.
      $('a[href=#]').prop('href', 'javascript:;');

      // Update the controls when the user connects to Facebook
      this.facebookConnector.once('connected', function (event, profile) {
        // Update connection status.
        $('#facebook').text('Connected as ' + profile.name + '.');

        // Enable second step.
        $('.step.two').removeClass('inactive');
        $('#topic').prop('disabled', false)
                   .focus();
      });
    },
  };

  return Application;
});
