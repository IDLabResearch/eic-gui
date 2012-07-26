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
      'lib/OpenLayers' : {
        exports : 'OpenLayers'
      },
      'lib/jplayer.min' : {
        exports : 'jplayer'
      },
    },
  });

  var scripts = ['lib/jquery',
    'eic/SlidePresenter',
    'eic/FacebookConnector',
    'eic/TopicSlidePresenter',
    'eic/generators/BaseSlideGenerator',
    'eic/generators/IntroductionSlideGenerator',
    'eic/generators/CombinedSlideGenerator',
    'eic/generators/GoogleImageSlideGenerator',
    'eic/generators/StretchSlideGenerator',
    'eic/generators/TitleSlideGenerator',
    'eic/generators/VideoSlideGenerator',
    'eic/generators/TTSGenerator',
    'eic/generators/MapsSlideGenerator',
    'eic/generators/TopicSlideGenerator',
	'eic/generators/YouTubeSlideGenerator'];


  requirejs(scripts, function (jQuery) {
    var scriptHolder = {};
    for (var i = 0; i < scripts.length; i++)
      scriptHolder[scripts[i].replace(/^(\w+\/)*/, '')] = arguments[i];
    if (window.startApplication)
      window.startApplication(jQuery, scriptHolder);
  });
})(window.requirejs);
