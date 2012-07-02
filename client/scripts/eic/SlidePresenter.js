define(['lib/jquery'], function ($) {
  "use strict";

  function SlidePresenter(container, generator) {
    this.$container = $(container);
    this.generator = generator;
  }

  SlidePresenter.prototype = {
    start: function () {
      if (this.started)
        return;

      var self = this;
      function showNext() {
        if (self.generator.hasNext()) {
          // remove children that were transitioning out
          self.$container.children('.transition-out').remove();
          // start the transition of other children
          self.$container.children().addClass('transition-out');
          // add the next slide and start it
          var $nextSlide = self.generator.next();
          self.$container.prepend($nextSlide);
          $nextSlide.trigger('start')
                    .one('stop', showNext);
        }
      }
      showNext();

      this.started = true;
    }
  };

  return SlidePresenter;
});
