<<<<<<< HEAD
define(['lib/jquery', 'eic/FacebookConnector', 'eic/TopicToTopicSlideGenerator', 'eic/SlidePresenter'], function ($, FacebookConnector, TopicToTopicSlideGenerator, SlidePresenter) {
	"use strict";

  function Application() {
		this.facebookConnector = new FacebookConnector();
  }

=======
define(['lib/jquery', 'eic/FacebookConnector',
        'eic/TopicToTopicSlideGenerator', 'eic/SlidePresenter'],
function ($, FacebookConnector, TopicToTopicSlideGenerator, SlidePresenter) {
  "use strict";
  
  // The main "Everything Is Connected" application.
  function Application() {
    this.facebookConnector = new FacebookConnector();
  }
  
>>>>>>> b76b7e25ffd4ead6281d0cc8a0ac1449e5dd5ff8
  Application.prototype = {
    // Initializes the application.
    init: function () {
      this.facebookConnector.init();
      this.attachEventHandlers();
      // Make sure the topic is empty (browsers can cache text).
      $('#topic').val('');
<<<<<<< HEAD
      this.facebookConnector.init();
=======
>>>>>>> b76b7e25ffd4ead6281d0cc8a0ac1449e5dd5ff8
    },
    
    // Lets the user connect with a Facebook account.
    connectToFacebook: function () {
      var self = this;
      
      $('#facebook').text('Connecting…');
<<<<<<< HEAD

=======
      
>>>>>>> b76b7e25ffd4ead6281d0cc8a0ac1449e5dd5ff8
      this.facebookConnector.connect(function (error, profile) {
        self.profile = profile;
        
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
      var topic = this.topic = $('#topic').val(),
          valid = topic.trim().length > 0;
      
      // Enable third step if the topic is valid.
      $('.step.three')[valid ? 'removeClass' : 'addClass']('inactive');
      $('#play').prop('disabled', !valid);
    },
    
    // Starts the movie about the connection between the user and the topic.
    playMovie: function () {
      var $slides = $('<div>').addClass('slides'),
          $wrapper = $('<div>').addClass('slides-wrapper')
                               .append($slides);
      
      // Hide the main panel.
      $('#main').slideUp();
      $('body').append($wrapper);
      
      // Show the slides panel.
      $slides.hide();
      $wrapper.hide().fadeIn($.proxy($slides, 'fadeIn', 1000));
      
      // Create and start the slide show.
      var generator = new TopicToTopicSlideGenerator(this.profile, this.topic);
      var presenter = new SlidePresenter($slides, generator);
      presenter.start();
    },
    
    // Attaches event handlers to the HTML controls.
    attachEventHandlers: function () {
      // Initialize the controls of each step.
      $('#facebook-connect').click($.proxy(this, 'connectToFacebook'));
      $('#topic').on('change keyup', $.proxy(this, 'updateTopic'));
      $('#play').click($.proxy(this, 'playMovie'));

      // Don't let empty links trigger a location change.
      $('a[href=#]').prop('href', 'javascript:;');
    },
  };
  
  return Application;
});
