define(['lib/jquery', 'eic/AutocompleteTopic',
        'eic/FacebookConnector',
        'eic/generators/TopicToTopicSlideGenerator', 'eic/SlidePresenter'],
function ($, autocompleteTopic,
          FacebookConnector,
          TopicToTopicSlideGenerator, SlidePresenter) {
  "use strict";
  
  // The main "Everything Is Connected" application.
  function Application() {
    this.facebookConnector = new FacebookConnector();
    this.generator = new TopicToTopicSlideGenerator();
  }
  
  Application.prototype = {
    // Initializes the application.
    init: function () {
      this.facebookConnector.init();
      this.initControls();
    },
    
    // Lets the user connect with a Facebook account.
    connectToFacebook: function () {
      var self = this;
      
      $('#facebook').text('Connecting…');
      
      this.facebookConnector.connect(function (error, profile) {
        self.generator.setStartTopic(profile);
        
        // Update connection status.
        $('#facebook').text('Connected as ' + profile.name + '.');

        // Enable second step.
        $('.step.two').removeClass('inactive');
        $('#topic').prop('disabled', false)
                   .focus();
      });
    },
    
    // Updates the goal topic.
    updateTopic: function () {
      var label = $('#topic').val(),
          valid = label.trim().length > 0;
      
      this.topic = {
        label: label,
        uri: valid ? 'http://dbpedia.org/resource/' + label.replace(/[^\w]/g, '_') : ''
      };
      
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
      
      // Create and start the slide show.
      this.generator.setEndTopic(this.topic);
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
    },
  };
  
  return Application;
});
