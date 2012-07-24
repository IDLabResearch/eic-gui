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
    
    attachEventHandlers: function () {
      $('#facebook-connect').click($.proxy(this, 'connectToFacebook'));
    },
  };
  
  return Application;
});
