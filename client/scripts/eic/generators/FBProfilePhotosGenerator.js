define(['lib/jquery', 'eic/generators/BaseSlideGenerator'],
function ($, BaseSlideGenerator) {
  "use strict";

  
  function combineImagesToCanvas(images, canvas) {
    var numOfImages = images.length;
    var canvas = document.createElement("canvas");
    var context = canvas.getContext("2d");
		var i=0,j=0;
		
    $.each(images, function(index, image) {
      context.drawImage(image, i * 100, j * 100, 100, 100);
      i++;
      j++;
      if (i % 5 === 0)
        j++;
      if (j == 5)
        return;
    });
    
    convertCanvasToImage(image);
  }

  

  function loadImages(sources, canvas, callback) {
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
          callback(images, canvas);
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
  function convertCanvasToImage(canvas) {
    var image = new Image();
    image.src = canvas.toDataURL("image/png");
    return image;
  }

  var defaultDuration = 1000;

  /** Generator of images slides from Facebook User Profile search results.
   * Parameters: a facebookconnector of a logged in fb user and no of maxResutls
   */
  function FBProfilePhotosGenerator(fbConnector, maxResults) {
    BaseSlideGenerator.call(this);
    this.fbConnector = fbConnector;
    if (typeof maxResults == 'undefined')
			this.maxResults = 5;
    else
			this.maxResults = maxResults;
    this.slides = [];
  }

  $.extend(FBProfilePhotosGenerator.prototype,
           BaseSlideGenerator.prototype,
  {
    /** Checks whether any slides are left. */
    hasNext: function () {
      return this.slides.length > 0;
    },

    /** Fetches a list of images about the user in which he is tagged. */

    init: function () {
      if (this.inited)
        return;
        
      var self = this;
      
      this.fbConnector.get('photos', function (response) {
        $.each(response.data.slice(0, self.maxResults), function (number, photo) {
          self.addImageSlide(photo.source);
        });
      });
      
      var myPlaces = new Array();
      this.fbConnector.findPlacesNearMe(function (response) {
				$.each(response.data.slice(0, 25), function (number, place) {
          self.fbConnector.getPlace(place.id, function (response) {
						myPlaces.push(response.picture);
          });
          
        });
      });
      
      loadImages(myPlaces,combineImagesToCanvas);
      

      this.inited = true;
    },


    /** Advances to the next slide. */
    next: function () {
      return this.slides.shift();
    },

    /** Adds a new image slide. */
    addImageSlide: function (imageUrl) {
      var $image = $('<img>').attr('src', imageUrl),
          slide = this.createBaseSlide('image', $image, defaultDuration);
      this.slides.push(slide);
      this.emit('newSlides');
    },
  });

  return FBProfilePhotosGenerator;
});
