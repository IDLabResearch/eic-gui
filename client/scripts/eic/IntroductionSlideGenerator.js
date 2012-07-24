define(['lib/jquery', 'eic/BaseSlideGenerator'],
function ($, BaseSlideGenerator) {
	"use strict";
	 
	var defaultDuration = 1000;
	
	/** Generator that creates introductory slides */
	  function IntroductionSlideGenerator() {
	    BaseSlideGenerator.call(this);
	  }
	  

	  $.extend(IntroductionSlideGenerator.prototype,
	    BaseSlideGenerator.prototype,
	  {
	    /** Checks whether the title slide has been shown. */
	    hasNext: function () {
	      return this.done !== true;
	    },

	    /** Advances to the title slide. */
	    next: function () {
	      if (!this.hasNext())
	        return;

	      var slide = this.createBaseSlide('introduction', $('<h1>').text("Introduction"), defaultDuration);
	      
	      this.done = true;

	      return slide;
	    },
	  });
	  
	  return IntroductionSlideGenerator;
});