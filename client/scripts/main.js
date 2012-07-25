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
    },
  });
  
  require(['eic/Application'], function (Application) {
    new Application().init();
  });
})(window.requirejs);

