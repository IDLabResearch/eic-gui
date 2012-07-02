define(['lib/jquery'], function ($) {
  "use strict";

  function SlidePresenter(container, generator) {
    this.$container = $(container);
    this.generator = generator;
  }

  SlidePresenter.prototype = {
    start: function () {
      var self = this;

      function showNext() {
        if (self.generator.hasNext()) {
          // remove children that were transitioning out
          self.$container.children('.transition-out').remove();
          // start the transition of other children
          self.$container.children().addClass('transition-out');
          // add the next slide
          self.$container.prepend(self.generator.next());
        }
      }

      window.setInterval(showNext, 1000);
      showNext();
    }
  };

  return SlidePresenter;
});
