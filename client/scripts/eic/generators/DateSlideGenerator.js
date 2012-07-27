define(
    [ 'lib/jquery', 'eic/generators/BaseSlideGenerator' ],
    function ($, BaseSlideGenerator) {
      "use strict";

      var defaultDuration = 2000;

      /** Generator that creates a Date slide for a datestring. */
      function DateSlideGenerator(datestring) {
        BaseSlideGenerator.call(this);

        this.topic = { label : datestring };

        this.weekday = new Array(7);
        this.weekday[0] = "Sunday";
        this.weekday[1] = "Monday";
        this.weekday[2] = "Tuesday";
        this.weekday[3] = "Wednesday";
        this.weekday[4] = "Thursday";
        this.weekday[5] = "Friday";
        this.weekday[6] = "Saturday";
        this.month = new Array(12);
        this.month[0] = "JANUARY";
        this.month[1] = "FEBRUARY";
        this.month[2] = "MARCH";
        this.month[3] = "APRIL";
        this.month[4] = "MAY";
        this.month[5] = "JUNE";
        this.month[6] = "JULY";
        this.month[7] = "AUGUST";
        this.month[8] = "SEPTEMBER";
        this.month[9] = "OCTOBER";
        this.month[10] = "NOVEMBER";
        this.month[11] = "DECEMBER";
      }

      $.extend(
        DateSlideGenerator.prototype,
        BaseSlideGenerator.prototype,
        {
          /** Checks whether the Date slide has been shown. */
          hasNext : function () {
            return this.done !== true;
          },

          /** Advances to the Date slide. */
          next : function () {
            if (!this.hasNext())
              return;

            var d = new Date(this.topic.label);

            var $datediv = $(
                '<div/>',
                {
                id : 'date',
                style : "position:relative; top:100px; left:250px; width:300px; height:400px; background-color: white; border: 1px solid red;",
              });
            var $monthdiv = $(
                '<div/>',
                {
                id : 'month',
                style : "position:relative; top:10px; left:10px; width:280px; height:50px; text-align: center; font: 40px Georgia, serif;",
                text : this.month[d.getMonth()],
              });
            var $yeardiv = $(
                '<div/>',
                {
                id : 'year',
                style : "position:relative; top:5px; left:10px; width:280px; height:30px; text-align: center; font: 30px Georgia, serif;",
                text : d.getFullYear(),
              });
            var $daydiv = $(
                '<div/>',
                {
                id : 'day',
                style : "position:relative; top:0px; left:10px; width:280px; height:200px; text-align: center; font: 200px Georgia, serif;",
                text : d.getDate(),
              });
            var $weekdaydiv = $(
                '<div/>',
                {
                id : 'weekday',
                style : "position:relative; top:20px; left:10px; width:280px; height:50px; text-align: center; font: 50px Georgia, serif;",
                text : this.weekday[d.getDay()],
              });
            $($datediv).append($monthdiv);
            $($datediv).append($yeardiv);
            $($datediv).append($daydiv);
            $($datediv).append($weekdaydiv);
            var slide = this.createBaseSlide('date', $datediv,
                defaultDuration);

            this.done = true;

            return slide;
          },
        });

      return DateSlideGenerator;
    });
