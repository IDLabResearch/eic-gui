
(function (requirejs) {
  "use strict";

  requirejs.config({
    baseUrl : 'scripts',
    shim : {
      'lib/jquery': {
        exports: 'jQuery'
      },
      'lib/jquery.ui.core': {
        deps: ['lib/jquery']
      },
      'lib/jquery.ui.widget': {
        deps: ['lib/jquery.ui.core']
      },
      'lib/jquery.ui.position': {
        deps: ['lib/jquery.ui.core']
      },
      'lib/jquery.ui.autocomplete': {
        deps: ['lib/jquery.ui.core', 'lib/jquery.ui.widget', 'lib/jquery.ui.position']
      },
      'lib/jvent': {
        exports: 'jvent'
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

