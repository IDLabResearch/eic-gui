/*!
 * EIC YouTubeSlideGenerator
 * Copyright 2012, Multimedia Lab - Ghent University - iMinds
 * Licensed under GPL Version 3 license <http://www.gnu.org/licenses/gpl.html> .
 */
define(['lib/jquery', 'eic/generators/BaseSlideGenerator'],
function ($, BaseSlideGenerator) {
  "use strict";
  
  /*
   * CLEANUP
   **/
  
  var playerCount = 0;

  /** Generator of YouTube videos using the YouTube API
   * The option parameter is a hash consisting of
   * - the maximum number of videos to return
   * - the maximum duration (in milliseconds) of a video
   * - the skipping duration (in milliseconds) at the beginning of the video
   */
  function YouTubeSlideGenerator(topic, options) {
    BaseSlideGenerator.call(this);

    this.topic = topic;
    options = options || {};
    this.maxVideoCount = options.maxVideoCount || 1;
    this.maxVideoDuration = options.maxVideoDuration || 5000;
    this.skipVideoDuration = options.skipVideoDuration || 10000;
    this.orderMethod = options.orderMethod || 'relevance';
    this.totalDuration = 0;
    this.slides = [];
  }

  $.extend(YouTubeSlideGenerator.prototype,
           BaseSlideGenerator.prototype,
  {
    /** Checks whether any slides are left. */
    hasNext: function () {
      return this.slides.length > 0;
    },

    /** Fetches a list of images about the topic. */
    init: function () {
      if (this.inited)
        return;
      
      var self = this;
      $.getScript("http://www.youtube.com/player_api", function () {
        searchVideos(self, 0, self.maxVideoCount, 0);
      });
      
      this.inited = true;
      this.status = "inited";
    },

    /** Advances to the next slide. */
    next: function () {
      return this.slides.shift();
    },
    
    /** Prepare video by playing and pausing it, in order to prebuffer its contents. */
    prepare: function () {
      var self = this, player = self.player;
      
      // if we did not start preparations yet, and the player object is ready
      if (self.status === "inited" && player && player.playVideo) {
        // start preparing by playing the video
        self.status = "preparing";
        player.playVideo();
        
        // as soon as the video plays, pause it...
        player.addEventListener('onStateChange', function () {
          // ...but only if we're still in preparation mode (and not playing for real)
          if (self.status === "preparing" && player.getPlayerState() == window.YT.PlayerState.PLAYING)
            player.pauseVideo();
        });
      }
    },

    /** Adds a new video slide. */
    addVideoSlide: function (videoID, duration) {
      var self = this,
          start = this.skipVideoDuration,
          end = this.skipVideoDuration + this.maxVideoDuration;
      if (duration <= this.maxVideoDuration + this.skipVideoDuration)
        end = duration;
      if (duration < this.maxVideoDuration + this.skipVideoDuration && duration >= this.maxVideoDuration)
        start = 0;
      duration = end - start;
      this.totalDuration += duration;
      
      // create a container that will hide the player
      var playerId = 'ytplayer' + (++playerCount),
          $container = $('<div>').append($('<div>').prop('id', playerId))
                                 .css({ width: 0, height: 0, overflow: 'hidden' });
      $('body').append($container);
      // create the player in the container
      var player = this.player = new window.YT.Player(playerId, {
        playerVars: {
          autoplay: 0,
          controls: 0,
          start: (start / 1000),
          end: (end / 1000),
          wmode: 'opaque'
        },
        videoId: videoID,
        width: 800,
        height: 600,
        events: { onReady: function (event) { event.target.mute(); } }
      });
      
      // create a placeholder on the slide where the player will come
      var $placeholder = $('<div>'),
          slide = this.createBaseSlide('youtube', $placeholder, duration);
      // if the slide starts, move the player to the slide
      slide.once('started', function () {
        // flag our state to make sure prepare doesn't pause the video
        self.status = 'started';
        
        // make video visible
        var offset = $placeholder.offset();
        player.playVideo();
        $container.css({
          // move to the location of the placeholder
          position: 'absolute',
          top: offset.top,
          left: offset.left,
          // and make the container show its contents
          width: 'auto',
          height: 'auto',
          overflow: 'auto'
        });
      });
      slide.once('stopped', function () {
        $container.fadeOut(function () {
          player.stopVideo();
          $container.remove();
        });
      });
      
      this.slides.push(slide);
      this.emit('newSlides');
    },
  });
  
  function searchVideos(self, startResults, maxResult, skip) {
    if (maxResult > 50) { //YouTube API restriction
      maxResult = 50;
    }
    var inspected = 0;
    var resultCounter = startResults;
    $.ajax('https://gdata.youtube.com/feeds/api/videos?v=2&max-results=' + maxResult + '&orderby=' + self.orderMethod + '&alt=jsonc&q=' + self.topic.label)
     .success(function (response) {
        var nrOfItems = response.data.items.length;
        response.data.items.forEach(function (item) {
          if (inspected >= skip && item.restrictions === undefined) {
            $.ajax('http://www.youtube.com/get_video_info?video_id=' + item.id + '&el=embedded')
            .success(function (res) {
              if (res.substr(0, 11) != 'status=fail' && resultCounter != self.maxVideoCount) {
                self.addVideoSlide(item.id, item.duration * 1000);
                resultCounter++;
              }
            })
            .always(function (res) {
              inspected++;
              if (resultCounter != self.maxVideoCount) {
                checkStatus(self, inspected, nrOfItems, maxResult, resultCounter);
              }
            });
          } else {
            inspected++;
            if (resultCounter != self.maxVideoCount) {
              checkStatus(self, inspected, nrOfItems, maxResult, resultCounter);
            }
          }
        });
      });
  }
  
  function checkStatus(self, inspected, nrOfItems, maxResult, foundResults) {
    if (inspected == nrOfItems && nrOfItems == maxResult && maxResult != 50) {
      searchVideos(self, foundResults, maxResult * 2, inspected);
    }
  }
  
  return YouTubeSlideGenerator;
});




