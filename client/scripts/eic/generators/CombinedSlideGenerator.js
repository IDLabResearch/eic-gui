define(['lib/jquery', 'eic/generators/BaseSlideGenerator'], function ($, BaseSlideGenerator) {
  "use strict";

  /** Generator that provides slides from child generators */
  function CombinedSlideGenerator(generators) {
    BaseSlideGenerator.call(this);
    this.emitNewSlidesEvent = $.proxy(function () { this.emit('newSlides'); }, this);

    this.generators = [];
    if (generators)
      for (var i = 0; i < generators.length; i++)
        this.addGenerator(generators[i], true);
  }

  $.extend(CombinedSlideGenerator.prototype,
           BaseSlideGenerator.prototype,
  {
    /** Checks whether at least one child generator has a next slide. */
    hasNext: function () {
      return this.generators.some(function (g) { return g.hasNext(); });
    },

    /** Initialize all child generators. */
    init: function () {
      if (!this.inited) {
        this.generators.forEach(function (g) { g.init(); });
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
      // initialize the generator and add it to the list
      if (!suppressInit)
        generator.init();
      this.generators.push(generator);

      // signal the arrival of new slides
      generator.on('newSlides', this.emitNewSlidesEvent);
      if (generator.hasNext())
        this.emitNewSlidesEvent();
    }
  });
  
  return CombinedSlideGenerator;
});
