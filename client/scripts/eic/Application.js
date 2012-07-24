define(['lib/jquery'],
function ($) {
  "use strict";
  
  function Application() { }
  
  Application.prototype = {
    start: function () {
      this.attachEventHandlers();
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
      $('#start').prop('disabled', !valid);
    },
    
    attachEventHandlers: function () {
      $('#facebook-connect').click($.proxy(this, 'connectToFacebook'));
      $('#topic').on('change keyup', $.proxy(this, 'updateMovieStatus'));
    },
  };
  
  return Application;
});
