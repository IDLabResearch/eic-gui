define(['lib/jquery', 'eic/generators/BaseSlideGenerator', 'eic/FacebookConnector'], function ($, BaseSlideGenerator, FacebookConnector) {
  "use strict";

  var defaultDuration = 1000;
  
  var mosaicShow = false;
  var mosaicMaxNumTilesWide = 7;
  var mosaicSlideDuration = 2500;

  /** Generator of images slides from Facebook User Profile search results.
   * Parameters: a facebookconnector of a logged in fb user and no of maxResutls
   */
  function FBProfilePhotosGenerator(maxResults) {
    BaseSlideGenerator.call(this);
    this.fbConnector = new FacebookConnector();
    this.maxResults = maxResults || 7;
    this.slides = [];
  }


  $.extend(FBProfilePhotosGenerator.prototype, BaseSlideGenerator.prototype, {
    /** Checks whether any slides are left. */
    hasNext : function () {
      return this.slides.length > 0;
    },

    /** Fetches a list of images about the user in which he is tagged. */
    init : function () {
      if (this.inited)
        return;

      var self = this;
      
      $(self).queue(profilePictures(self, self.fbConnector));

      if (mosaicShow) {
        $(self).queue(composeFBMosaic(self, 'neighboorhoud', this.fbConnector.findPlacesNearMe));
        $(self).queue(composeFBMosaic(self, 'likes', this.fbConnector.get));
        $(self).queue(composeFBMosaic(self, 'music', this.fbConnector.get));
        $(self).queue(composeFBMosaic(self, 'movies', this.fbConnector.get));
        $(self).queue(composeFBMosaic(self, 'friends', this.fbConnector.get));
      }
      
      this.inited = true;
    },

    /** Advances to the next slide. */
    next : function () {
      return this.slides.shift();
    },

    /** Adds a new image slide. */
    addImageSlide: function (imageUrl, duration) {
      var $image = imageUrl;
      if (typeof imageUrl === 'string')
        $image = $('<img>').prop('src', imageUrl)
                           .css({ 'min-height': '100%' });
          
      var slide = this.createBaseSlide('image', $image, duration || defaultDuration);
      slide.on('started', function () {
        setTimeout($.proxy($image, 'addClass', 'zoom'), 100);
      });
            
      this.slides.push(slide);
      this.emit('newSlides');
    },
  });

  function addSlides(target, myPlaces) {
    loadImages(myPlaces, function (response) {
      target.addImageSlide(response, mosaicSlideDuration);
    });
  }
 
  function placeImages(target, myPlaces, type, response, queue) {
    var q = $({});
    var sqrt = Math.floor(Math.sqrt(response.data.length));
    var sq = sqrt * sqrt;
    var mq = mosaicMaxNumTilesWide * mosaicMaxNumTilesWide;
    var max = mq < sq ? mq : sq;
    $.each(response.data.slice(0, max), function (number, place) {
      q.queue("r", placeImage(target, myPlaces, place, type, queue, max));
    });
    q.dequeue("r");
  }

  function placeImage(target, myPlaces, place, type, queue, max) {
    if (type == 'friends') {
      target.fbConnector.getPlace(place.id + '/picture', function (response) {
        myPlaces.push(response.data.url);
        if (myPlaces.length == max) {
          queue.dequeue("s");
        }
      });
    } else {
      target.fbConnector.getPlace(place.id, function (response) {
        myPlaces.push(response.picture);
        if (myPlaces.length == max) {
          queue.dequeue("s");
        }
      });
    }
  }

  function profilePictures(target, fbConnector) {
    fbConnector.get('photos?fields=source', function (response) {
      response.data.slice(0, target.maxResults).forEach(function (photo) {
        target.addImageSlide(photo.source);
      });
    });
  }

  function combineImagesToCanvas(images, callback) {
    var numOfImages = Object.keys(images).length;
    var sqrt = Math.floor(Math.sqrt(numOfImages));
    var sq = sqrt * sqrt;
    var canvas = document.createElement("canvas");
    var max_width = 600;
    canvas.width  = sqrt * Math.floor(max_width / sqrt);
    canvas.height = sqrt * Math.floor(max_width / sqrt);
    var context = canvas.getContext("2d");
    var i = 0, j = 0;

    $.each(images, function (index, image) {
      context.drawImage(image, (i % sqrt) * Math.floor(max_width / sqrt), j * Math.floor(max_width / sqrt), Math.floor(max_width / sqrt), Math.floor(max_width / sqrt));
      i++;
      if ((i % sqrt) === 0)
        j++;
      if (j === sqrt)
        return;
    });
    //$('#canvas-demo').append(canvas);
    convertCanvasToImage(canvas, callback);
  }

  function loadImages(sources, callback) {
    var images = {};
    var loadedImages = 0;
    var numImages = sources.length;
    
    for (var src in sources) {
      images[src] = new Image();
      images[src].onload = function () {
        if (++loadedImages >= numImages) {
          combineImagesToCanvas(images, callback);
        }
      };
      images[src].src = sources[src];
    }
  }

  function convertImageToCanvas(image) {
    var canvas = document.createElement("canvas");
    canvas.width = image.width;
    canvas.height = image.height;
    canvas.getContext("2d").drawImage(image, 0, 0);

    return canvas;
  }

  // Converts canvas to an image
  function convertCanvasToImage(canvas, callback) {
    //Unsafe - found no short term solution to fix this slide
    //var image = new Image();
    //image.src = canvas.toDataURL("image/png");
    //callback(image.src);
    callback(canvas);
  }
  
  function composeFBMosaic(target, type, fb_connector_call) {
    var q = $({});
    var items = [];

    fb_connector_call(type, function (response) {
      $(target).queue(placeImages(target, items, type, response, q));
    });
    
    q.queue("s", function () {
      addSlides(target, items);
      q.dequeue("s");
    });
  }

  return FBProfilePhotosGenerator;
});
