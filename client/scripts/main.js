(function (requirejs) {
  "use strict";
  
  requirejs.config({
    baseUrl: 'scripts',
    shim: {
      'lib/jquery': {
        exports: 'jQuery',
      }
    },
  });
  
  var scripts = [
    'lib/jquery',
    'eic/SlidePresenter',
    'eic/TitleSlideGenerator',
    'eic/GoogleImageSlideGenerator',
    'eic/CombinedSlideGenerator',
  ];

  requirejs(scripts, function () {
    if (window.startApplication)
      window.startApplication.apply(window, arguments);
  });
})(window.requirejs);
