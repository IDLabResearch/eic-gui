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
    'eic/BaseSlideGenerator',
    'eic/IntroductionSlideGenerator',
    'eic/CombinedSlideGenerator',
    'eic/GoogleImageSlideGenerator',
    'eic/SlidePresenter',
    'eic/StretchSlideGenerator',
    'eic/TitleSlideGenerator',
    'eic/VideoSlideGenerator',
    'eic/TTSGenerator',
    'eic/FacebookConnector',
    'eic/MapsSlideGenerator'];

  requirejs(scripts, function (jQuery) {
    var scriptHolder = {};
    for (var i = 0; i < scripts.length; i++)
      scriptHolder[scripts[i].replace(/^\w+\//, '')] = arguments[i];
    if (window.startApplication)
      window.startApplication(jQuery, scriptHolder);
  });
})(window.requirejs);
