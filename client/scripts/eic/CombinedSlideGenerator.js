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

    next: function () {
      var generator = this.generators[0];
      while (this.generators.length) {
        if (generator.hasNext())
          return generator.next();
        else
          generator = this.generators.shift();
      }
    },
    
    addGenerator: function (generator) {
      this.generators.push(generator);
    }
  };
  
  return CombinedSlideGenerator;
});
