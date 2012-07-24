(function (requirejs) {
  "use strict";
  
  requirejs.config({
    baseUrl: 'scripts',
    shim: {
      'lib/jquery': { exports: 'jQuery' },
      'lib/jvent': { exports: 'jvent' },
    },
  });

  var scripts = [
    'lib/jquery',
    'eic/FacebookConnector',
  ];

  requirejs(scripts, function (jQuery) {
    var scriptHolder = {};
    for (var i = 0; i < scripts.length; i++)
      scriptHolder[scripts[i].replace(/^\w+\//, '')] = arguments[i];
    if (window.startApplication)
      window.startApplication(jQuery, scriptHolder);
  });

  require(['eic/Application'], function (Application) {
    new Application().start();
  });
})(window.requirejs);