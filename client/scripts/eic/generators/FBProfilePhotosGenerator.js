define(['lib/jquery', 'eic/generators/BaseSlideGenerator', 'eic/FacebookConnector'], function ($, BaseSlideGenerator, FacebookConnector) {
	"use strict";

  //Maximum number of mosaic tiles and time to show
	var mosaicMaxNumTilesWide = 7;
	var defaultDuration = 750;
	var mosaicSlideDuration = 2500;
	
  function setInited(target, object) {
    object.inited = true;
  }

  function addSlides(target, myPlaces) {
		console.log('slides' + myPlaces.length);
    loadImages(myPlaces, function (response) {
      target.addImageSlideWithDuration(mosaicSlideDuration, response);
    });
  }
 
  function placeImages(target, myPlaces, type, response, queue) {
		var q = $({});
		var sqrt = Math.floor(Math.sqrt(response.data.length));
		console.log(' Square root :' + sqrt);
    var sq = sqrt * sqrt;
    var mq = mosaicMaxNumTilesWide * mosaicMaxNumTilesWide;
    var max = mq < sq ? mq : sq;
    console.log(' Max :' + max);
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
					console.log('max reached');
				}
			});
		} else {
      target.fbConnector.getPlace(place.id, function (response) {
        myPlaces.push(response.picture);
        if (myPlaces.length == max) {
          queue.dequeue("s");
          console.log('max reached');
        }
			});
		}
  }

  function profilePictures(target, fbConnector) {
		fbConnector.get('', function (response) {
      $(target).queue(function () {
				console.log(response);
				var bio = response.bio || 'All of this happened';
        var $title = $('<h1>').text('You... ' + bio), slide = target.createBaseSlide('title', $title, 1500);
        target.slides.push(slide);
        target.emit('newSlides');
			});
		});

    fbConnector.get('photos', function (response) {
      var $title = $('<h1>').text('Your photos...'),
          slide = target.createBaseSlide('title', $title, 1000);
      target.slides.push(slide);
      target.emit('newSlides');
      
			$.each(response.data.slice(0, target.maxResults), function (number, photo) {
        target.addImageSlide(photo.source);
      });
    });
  }

  function combineImagesToCanvas(images, callback) {
    var numOfImages = Object.keys(images).length;
    console.log('images length ' + numOfImages);
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
		console.log('making fb mosaic of type ' + type);
		var q = $({});
		var items = [];

    fb_connector_call(type, function (response) {
			$(target).queue(placeImages(target, items, type, response, q));
    });
    
    q.queue("s", function () {
      var $title = $('<h1>').text('Your ' + type + '...'),
          slide = target.createBaseSlide('title', $title, 1000);
      target.slides.push(slide);
      target.emit('newSlides');
      q.dequeue("s");
    });
    
    q.queue("s", function () {
      addSlides(target, items);
      q.dequeue("s");
		});
  }

  

  /** Generator of images slides from Facebook User Profile search results.
   * Parameters: a facebookconnector of a logged in fb user and no of maxResutls
   */
  function FBProfilePhotosGenerator(maxResults) {
    BaseSlideGenerator.call(this);
    this.fbConnector = new FacebookConnector();
    if (typeof maxResults == 'undefined')
      this.maxResults = 7;
    else
      this.maxResults = maxResults;
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

			$(self).queue(composeFBMosaic(self, 'neighboorhoud', this.fbConnector.findPlacesNearMe));
			$(self).queue(composeFBMosaic(self, 'likes', this.fbConnector.get));
			$(self).queue(composeFBMosaic(self, 'music', this.fbConnector.get));
			$(self).queue(composeFBMosaic(self, 'movies', this.fbConnector.get));
			$(self).queue(composeFBMosaic(self, 'friends', this.fbConnector.get));
      $(self).queue(setInited(self, this));
    },

    /** Advances to the next slide. */
    next : function () {
      return this.slides.shift();
    },
    
    getDuration: function () { return defaultDuration; },

    /** Adds a new image slide. */
    addImageSlide: function (imageUrl) {
		
			var $image;
			if (typeof imageUrl == 'string')
				$image = $('<img>').attr('src', imageUrl);
			else
				$image = imageUrl;
					
			var slide = this.createBaseSlide('image', $image, defaultDuration);
      //Ken Burns effect
      slide.on('started', function () {
        setTimeout(function () {
          slide.$element.find("img").addClass('zoom');
        },
      100
      );
      });
      this.slides.push(slide);
      this.emit('newSlides');
    },
    
    addImageSlideWithDuration: function (duration, imageUrl) {
			
			var $image;
			if (typeof imageUrl == 'string')
				$image = $('<img>').attr('src', imageUrl);
			else
				$image = imageUrl;
					
			var slide = this.createBaseSlide('image', $image, duration);
					
      this.slides.push(slide);
      this.emit('newSlides');
    }
  });

  return FBProfilePhotosGenerator;
});
