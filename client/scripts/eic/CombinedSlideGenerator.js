define(['lib/jquery'], function ($) {
  "use strict";

  /** Generator that provides slides from child generators */
  function CombinedSlideGenerator(generators) {
    this.generators = [];
    if (generators)
      for (var i = 0; i < generators.length; i++)
        this.addGenerator(generators[i], true);
  }

  CombinedSlideGenerator.prototype = {
    /** Checks whether at least one child generator has a next slide. */
    hasNext: function () {
      return this.generators.some(function (g) { return g.hasNext(); });
    },

    /** Initialize all child generators. */
    init: function () {
      if (!this.inited) {
        this.generators.each(function (g) { g.init(); });
        this.inited = true;
      }
    },

    /** Advance to the next slide of the first non-empty child generator. */
    next: function () {
      while (this.generators.length) {
        var generator = this.generators[0];
        if (generator.hasNext())
          return generator.next();
        else
          this.generators.shift();
      }
    },
    
    /** Add a child generator add the end of the list. */
    addGenerator: function (generator, suppressInit) {
      if (!suppressInit)
        generator.init();
      this.generators.push(generator);
    }
  };
  
  return CombinedSlideGenerator;
});
