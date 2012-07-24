(function (requirejs) {
  "use strict";
  
  requirejs.config({
    baseUrl: 'scripts',
    shim: {
      'lib/jquery': { exports: 'jQuery' },
      'lib/jvent': { exports: 'jvent' },
    },
  });

  require(['eic/Application'], function (Application) {
    new Application().start();
  });
})(window.requirejs);