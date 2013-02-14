/*!
 * EIC DateSlideGenerator
 * Copyright 2012, Multimedia Lab - Ghent University - iMinds
 * Licensed under GPL Version 3 license <http://www.gnu.org/licenses/gpl.html> .
 */
define(
[ 'lib/jquery', 'eic/generators/BaseSlideGenerator' ],
function ($, BaseSlideGenerator) {
  "use strict";

  var defaultDuration = 2000;
  
  var weekdays = ["Sunday", "Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday"];
  var months = ["January", "February", "March", "April", "May", "June", "July",
                "August", "September", "October", "November", "December"];

  /** Generator that creates a Date slide for a datestring. */
  function DateSlideGenerator(topic) {
    BaseSlideGenerator.call(this);

    this.date = new Date(topic.label);
    this.valid = (this.date instanceof Date && isFinite(this.date));
  }

  $.extend(
  DateSlideGenerator.prototype,
  BaseSlideGenerator.prototype,
  {
    /** Checks whether the Date slide has been shown. */
    hasNext : function () {
      return this.valid && !this.done;
    },

    /** Advances to the Date slide. */
    next : function () {
      if (!this.hasNext())
        return;

      var $calendar = $('<div>', { 'class': 'calendar' });
      var $month = $('<div>', { 'class': 'month', text: months[this.date.getMonth()] });
      var $year = $('<div>', { 'class': 'year', text: this.date.getFullYear() });
      var $day = $('<div>', { 'class': 'day', text: this.date.getDate() });
      var $weekday = $('<div>', { 'class': 'weekday', text: weekdays[this.date.getDay()] });
      $($calendar).append($month, $year, $day, $weekday);
      
      var slide = this.createBaseSlide('date', $calendar, defaultDuration);
      slide.on('started', function () { setTimeout($.proxy($calendar, 'addClass', 'zoom'), 100); });
      this.done = true;

      return slide;
    },
  });

  return DateSlideGenerator;
});
