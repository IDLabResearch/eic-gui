define(['lib/jquery'],
function ($) {
  "use strict";
  
  function Application() { }
  
  Application.prototype = {
    start: function () {
      console.log('Application started.');
    }
  };

  return Application;
});
