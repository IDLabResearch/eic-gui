define(['lib/jquery'], function ($) {
  "use strict";

  function CombinedSlideGenerator(generators) {
    this.generators = [];
    if (generators)
      for (var i = 0; i < generators.length; i++)
        this.addGenerator(generators[i]);
  }

  CombinedSlideGenerator.prototype = {
    hasNext: function () {
      return this.generators.some(function (g) { return g.hasNext(); });
    },

    init: function () {
      if (!this.inited) {
        this.generators.each(function (g) { g.init(); });
        this.inited = true;
      }
    },

    next: function () {
      while (this.generators.length) {
        var generator = this.generators[0];
        if (generator.hasNext())
          return generator.next();
        else
          this.generators.shift();
      }
    },
    
    addGenerator: function (generator) {
      generator.init();
      this.generators.push(generator);
    }
  };
  
  return CombinedSlideGenerator;
});
