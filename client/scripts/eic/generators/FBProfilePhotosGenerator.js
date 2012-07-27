define(['lib/jquery', 'eic/generators/BaseSlideGenerator'], function($, BaseSlideGenerator) {"use strict";

  function setInited(target, object) {
    object.inited = true;
  }

  function addSlides(target, myPlaces) {
		console.log('slides'+myPlaces.length);
		console.log(myPlaces.length);
    loadImages(myPlaces, function(response) {
      target.addImageSlide(response);
      console.log(response);
    });
  }
 
  function placeImages(target, myPlaces, response) {
    $.each(response.data.slice(0, 25), function(number, place) {
			$(target).queue("r",placeImage(target, myPlaces, place));
			console.log($(target).queue("s").length);
    });
    console.log($(target).queue("r").length);
    $(target).dequeue("r");
  }

  function placeImage(target, myPlaces, place) {
    target.fbConnector.getPlace(place.id, function(response) {
			myPlaces.push(response.picture); 
			console.log(response.picture);
			console.log(myPlaces.length);
			if(myPlaces.length == 25) {
				console.log('dequeuing s');
				$(target).dequeue("s");
			}    
    });
  }

  function profilePictures(target, fbConnector) {
    fbConnector.get('photos', function(response) {
			$.each(response.data.slice(0, target.maxResults), function(number, photo) {
        target.addImageSlide(photo.source);
      });
    });
  }

  function combineImagesToCanvas(images, callback) {
    var numOfImages = images.length;
    var canvas = document.createElement("canvas");
    canvas.width  = 500;
    canvas.height = 500;
    var context = canvas.getContext("2d");
    var i = 0, j = 0;

    $.each(images, function(index, image) {
      context.drawImage(image, ( i %5 ) * 100, j * 100, 100, 100);
      i++;
      if ((i % 5) === 0)
        j++;
      if (j === 5)
        return;
    });
		$('#canvas-demo').append(canvas);
    convertCanvasToImage(canvas, callback);
  }

  function loadImages(sources, callback) {
    var images = {};
    var loadedImages = 0;
    var numImages = 0;
    // get num of sources
    for (var src in sources) {
      numImages++;
    }
    for (var src in sources) {
      images[src] = new Image();
      images[src].onload = function() {
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
    var image = new Image();
    image.src = canvas.toDataURL("image/png");
    callback(image.src);
  }

  var defaultDuration = 1000;

  /** Generator of images slides from Facebook User Profile search results.
   * Parameters: a facebookconnector of a logged in fb user and no of maxResutls
   */
  function FBProfilePhotosGenerator(fbConnector, maxResults) {
    BaseSlideGenerator.call(this);
    this.fbConnector = fbConnector;
    if ( typeof maxResults == 'undefined')
      this.maxResults = 5;
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
      
      $(self).queue(profilePictures(self,this.fbConnector) );

			var myPlaces = new Array();
      
      this.fbConnector.findPlacesNearMe(function (response) {
				$(self).queue(placeImages(self,myPlaces,response));
      });
      
      $(self).queue("s", function() {
      	addSlides(self,myPlaces);
      	$(self).dequeue("s");
      });
      $(self).queue("s",function() {
      	setInited(self,this);
      	$(self).dequeue("s");
      });
    },

    /** Advances to the next slide. */
    next : function () {
      return this.slides.shift();
    },

    /** Adds a new image slide. */
    addImageSlide : function (imageUrl) {
      var $image = $('<img>').attr('src', imageUrl), slide = this.createBaseSlide('image', $image, defaultDuration);
      this.slides.push(slide);
      this.emit('newSlides');
    },
  });

  return FBProfilePhotosGenerator;
});