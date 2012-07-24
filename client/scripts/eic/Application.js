define(['lib/jquery'],
function ($) {
  "use strict";
  
  function Application() { }
  
  Application.prototype = {
    start: function () {
      this.attachEventHandlers();
      $('#topic').val('');
    },
    
    connectToFacebook: function () {
      window.setTimeout(function () {
        var profile = { name: "John Doe" };
        $('#facebook').text('Connected as ' + profile.name + '.');
        $('.step.two').removeClass('inactive');
        $('#topic').prop('disabled', false)
                   .focus();
      }, 100);
    },
    
    updateMovieStatus: function () {
      var topic = $('#topic').val(),
          valid = topic.trim().length > 0;
      $('.step.three')[valid ? 'removeClass' : 'addClass']('inactive');
      $('#play').prop('disabled', !valid);
    },
    
    playMovie: function () {
      var $slides = $('<div>').addClass('slides'),
          $wrapper = $('<div>').addClass('slides-wrapper')
                               .append($slides);
      $('#main').slideUp();
      $('body').append($wrapper);

      $slides.hide();
      $wrapper.hide().fadeIn($.proxy($slides, 'fadeIn', 1000));
    },
    
    attachEventHandlers: function () {
      $('#facebook-connect').click($.proxy(this, 'connectToFacebook'));
      $('#topic').on('change keyup', $.proxy(this, 'updateMovieStatus'));
      $('#play').click($.proxy(this, 'playMovie'));

      // Don't let empty links trigger a location change.
      $('a[href=#]').prop('href', 'javascript:;');
    },
  };
  
  return Application;
});
