({
  baseUrl: ".",
  name: "main",
  out: "main-built.js",
  paths: {
    requireLib: 'lib/require',
  },
  include: ['requireLib', 'lib/jquery.ui.autocomplete'],
  shim: {
    'lib/jquery': {
      exports: 'jQuery'
    },
    'lib/jquery.ui.autocomplete': {
      deps: ['lib/jquery.ui.core', 'lib/jquery.ui.widget', 'lib/jquery.ui.position']
    },
    'lib/jvent': {
      exports: 'jvent'
    },
    'lib/jplayer.min': {
      deps: ['lib/jquery']
    },
  },
})
