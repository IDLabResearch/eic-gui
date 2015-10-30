/*!
 * EIC YouTubeSlideGenerator
 *
 * This class generates slides that contain YouTube videos
 *
 * The videos are discovered using version 3 of the Youtube API. See
 * https://developers.google.com/youtube/v3/
 *
 * An API key needs to be configured in config/APIKeys under the property
 * "youtube". How to obtain such a key is described in
 * https://developers.google.com/youtube/v3/getting-started
 *
 * Copyright 2012, Multimedia Lab - Ghent University - iMinds
 * Licensed under GPL Version 3 license <http://www.gnu.org/licenses/gpl.html> .
 */
define(['lib/jquery', 'eic/Logger', 'eic/generators/BaseSlideGenerator', 'config/APIKeys'],
function ($, Logger, BaseSlideGenerator, apiKeys) {
  "use strict";
  var logger = new Logger("YouTubeSlideGenerator");

  var apiKey = apiKeys.youtube;
  
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
      $.getScript("https://www.youtube.com/iframe_api", function () {
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
          if (self.status === "preparing" && player.getPlayerState() == YT.PlayerState.PLAYING)
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
      var player = this.player = new YT.Player(playerId, {
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
  
  /** Search videos based on the topic's label
   * This uses the search to get a list of matching videos and then the video
   * resource to query their length.
   *
   * https://developers.google.com/youtube/v3/docs/search/list
   * https://developers.google.com/youtube/v3/docs/videos
   */
  function searchVideos(self, startResults, maxResult, skip) {
    if (maxResult > 50) { //YouTube API restriction
      maxResult = 50;
    }
    var inspected = 0;
    var resultCounter = startResults;
    var query_data = {
      part: 'snippet',
      maxResults: maxResult,
      order: self.orderMethod,
      type: 'video',
      videoEmbeddable: 'true',
      key: apiKey,
      q: self.topic.label
    };
    logger.log("Searching on Youtube for ", query_data);
    $.ajax({
      url: 'https://www.googleapis.com/youtube/v3/search',
      data: query_data,
      dataType: 'json',
      jsonp: false
    }).done(function (data) {
      var ids = data.items.map(function (item) { return item.id.videoId; });
      $.ajax({
        url: 'https://www.googleapis.com/youtube/v3/videos',
        data: {
          part: 'contentDetails',
          id: ids.join(','),
          key: apiKey
        },
        dataType: 'json',
        jsonp: false
      }).done(function (data) {
        var items = data.items,
            itemCount = Math.min(items.length, self.maxVideoCount);
        for (var i = 0; i < itemCount; i++) {
          var duration_iso = items[i].contentDetails.duration;
          var duration_ms = parseISO8601Duration(duration_iso);
          logger.log("Discovered video with id", items[i].id, "and duration", duration_iso, "==", duration_ms, "ms");
          self.addVideoSlide(items[i].id, duration_ms);
        }
      });
    });
  }

  /** Convert ISO8601 duration to ms
   * This is an incomplete implementation which likely works only for youtube.
   */
  function parseISO8601Duration(duration_iso) {
    // Poor man's parsing of ISO 8601 duration
    var duration_regex = /^PT(?:(\d+)H)?(?:(\d+)M)?(?:(\d+)S)?$/;
    var match = duration_regex.exec(duration_iso);
    var duration_ms;
    if (match) {
      duration_ms = 0;
      if (match[1]) { duration_ms += parseInt(match[1], 10) * 3600 * 1000; }
      if (match[2]) { duration_ms += parseInt(match[2], 10) * 60 * 1000; }
      if (match[3]) { duration_ms += parseInt(match[3], 10) * 1000; }
    }
    if (!duration_ms) {
      logger.log("Could not parse duration " + duration_iso + ". Assuming 1 day.");
      duration_ms = 24 * 3600 * 1000;
    }
    return duration_ms;
  }

  return YouTubeSlideGenerator;
});


