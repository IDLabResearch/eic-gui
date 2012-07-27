define(['lib/jquery', 'eic/generators/BaseSlideGenerator'],
function ($, BaseSlideGenerator) {
  "use strict";
  
  var playerCount = 0;
  var preload = false;

  /** Generator of YouTube videos using the YouTube API
   * The option parameter is a hash consisting of
   * - the maximum number of videos to return
   * - the maximum duration (in seconds) of a video
   * - the skipping duration (in seconds) at the beginning of the video
   */
  function YouTubeSlideGenerator(topic, options) {
    BaseSlideGenerator.call(this);

    this.topic = topic;
    options = options || {};
    this.maxVideoCount = options.maxVideoCount || 1;
    this.maxVideoDuration = options.maxVideoDuration || 5000;
    this.skipVideoDuration = options.skipVideoDuration || 10000;
    this.orderMethod = options.orderMethod || 'relevance';
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
    },

    /** Advances to the next slide. */
    next: function () {
      return this.slides.shift();
    },

    /** Adds a new video slide. */
    addVideoSlide: function (videoID, duration) {
      var start = this.skipVideoDuration;
      var end = this.skipVideoDuration + this.maxVideoDuration;
      if (duration <= this.maxVideoDuration + this.skipVideoDuration)
        end = duration;
      if (duration < this.maxVideoDuration + this.skipVideoDuration && duration >= this.maxVideoDuration)
        start = 0;
      duration = end - start;
      
      var playerId = 'ytplayer' + (++playerCount),
          $container = $('<div>').append($('<div>').prop('id', playerId))
                                 .css({ width: 0, height: 0, overflow: 'hidden' });
      $('body').append($container);
      
      var player = new window.YT.Player(playerId, {
        playerVars: {
          autoplay: preload ? 1 : 0,
          controls: 0,
          start: (start / 1000),
          end: (end / 1000),
          wmode: 'opaque'
        },
        videoId: videoID,
        width: 800,
        height: 600,
        events: { 'onReady': onPlayerReady }
      });
      
      var $placeholder = $('<div>'),
          slide = this.createBaseSlide('youtube', $placeholder, duration);
      slide.once('started', function () {
        var offset = $placeholder.offset();
        player.playVideo();
        $container.css({
          position: 'absolute',
          top: offset.top,
          left: offset.left,
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
    
    getDuration: function () { return this.maxVideoDuration; },
  });
  
  function onPlayerReady(event) {
    var player = event.target;
    player.mute();
    if (preload) {
      window.setTimeout($.proxy(player, 'playVideo'), 500);
    }
  }
  
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




