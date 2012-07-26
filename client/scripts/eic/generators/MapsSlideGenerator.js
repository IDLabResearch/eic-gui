define([ 'lib/jquery', 'lib/OpenLayers', 'eic/generators/BaseSlideGenerator' ],
    function ($, OpenLayers, BaseSlideGenerator) {
      "use strict";

      var defaultDuration = 3000;
      /**
       * Generator of images slides from Google Image search results.
       * Parameters: a topic and the maximum number of results to return
       */
      function MapsSlideGenerator(topic) {
        BaseSlideGenerator.call(this);
        this.topic = topic;
        this.slides = [];
      }

      $.extend(MapsSlideGenerator.prototype, BaseSlideGenerator.prototype, {

        init : function () {
          var $mapdiv = $('<div>').text('mapdiv');
          var map = new OpenLayers.Map();
          map.addLayer(new OpenLayers.Layer.OSM());
          map.zoomToMaxExtent();
          var slide = this.createBaseSlide('map', $mapdiv, defaultDuration);
          //map.render();
          this.slides.push(slide);
        },
  
        hasNext : function () {
          return this.slides.length > 0;
        },
  
        next : function () {
          return this.slides.shift();
        }
      });

      return MapsSlideGenerator;
    });