/*jshint browser: true*/

(function (requirejs) {
  "use strict";

  requirejs.config({
    baseUrl : 'scripts',
    shim : {
      'lib/jquery' : {
        exports : 'jQuery'
      },
      'lib/jvent' : {
        exports : 'jvent'
      },
      'lib/jplayer.min' : {
        exports : 'jplayer'
      }
    }
  });

  var scripts = ['lib/jquery',
    'eic/SlidePresenter',
    'eic/FacebookConnector',
    'eic/TTSService',
    'eic/generators/BaseSlideGenerator',
    'eic/generators/IntroductionSlideGenerator',
    'eic/generators/CompositeSlideGenerator',
    'eic/generators/GoogleImageSlideGenerator',
    'eic/generators/TitleSlideGenerator',
    'eic/generators/TopicSlideGenerator',
    'eic/generators/FBProfilePhotosGenerator',
    'eic/generators/YouTubeSlideGenerator',
    'eic/generators/IntroductionSlideGenerator'];

  requirejs(scripts, function (jQuery) {
    var scriptHolder = {};
    for (var i = 0; i < scripts.length; i++)
      scriptHolder[scripts[i].replace(/^(\w+\/)*/, '')] = arguments[i];
    if (window.startApplication)
      window.startApplication(jQuery, scriptHolder);
  });
})(window.requirejs);
