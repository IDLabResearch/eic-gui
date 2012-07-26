define(['lib/jquery', 'eic/BaseSlideGenerator'],
function ($, BaseSlideGenerator) {
  "use strict";

  /** Generator of YouTube videos using the YouTube API
   * The option parameter is a hash consisting of
   * - a topic
   * - the maximum number of videos to return
   * - the maximum duration (in seconds) of a video
   * - the skipping duration (in seconds) at the beginning of the video
   */
  function YouTubeSlideGenerator(options) {
    BaseSlideGenerator.call(this);

    var topic = options.topic;
    if (typeof topic === "string")
      topic = { label: topic };

    this.topic = topic;
    this.maxVideoCount = options.maxVideoCount || 3;
    this.maxVideoDurationInS = options.maxVideoDurationInS || 30;
    this.skipVideoDurationInS = options.skipVideoDurationInS || 10;
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
      var foundVideos = 0;
      var inspectedVideos = 0;
      var i = 0;
      while(foundVideos != this.maxVideoCount){
        var found = searchVideos(self, foundVideos, inspectedVideos + this.maxVideoCount, inspectedVideos);
        inspectedVideos += this.maxVideoCount;
        foundVideos += found;
        i++;
        if(i == 10)
          break;
      }
      this.inited = true;
    },

    /** Advances to the next slide. */
    next: function () {
      return this.slides.shift();
    },

    /** Adds a new video slide. */
    addVideoSlide: function (videoID, durationInS) {
      var start = this.skipVideoDurationInS;
      var end = this.skipVideoDurationInS + this.maxVideoDurationInS;
      if (durationInS <= this.maxVideoDurationInS + this.skipVideoDurationInS)
        end = durationInS;
      if (durationInS < this.maxVideoDurationInS + this.skipVideoDurationInS && durationInS >= this.maxVideoDurationInS)
        start = 0;
      
      var $iframe = $('<iframe>');
      $iframe.attr('class', 'youtube-player')
             .attr('type', 'text/html')
             .attr('width', '800')
             .attr('height', '600')
             .attr('frameborder', '0')
             .attr('src', 'http://www.youtube.com/embed/' + videoID + '?autoplay=1&start=' + start + '&end=' + end);
      
      var slide = this.createBaseSlide('YouTube', $iframe, (end - start) * 1000);
      this.slides.push(slide);
      this.emit('newSlides');
    },
  });
  
  function searchVideos(self, startResults, maxResults, skip) {
    var counter = 0;
    var resultCounter = startResults;
    $.ajax('https://gdata.youtube.com/feeds/api/videos?v=2&max-results=' + maxResults + '&orderby=viewCount&alt=jsonc&q=' + self.topic.label, {'async': false})
     .success(function (response) {
        response.data.items.forEach(function (item) {
          if (counter < skip) {
            counter++;
          } else if (resultCounter == self.maxVideoCount) {
            //we're done
          } else if (item.restrictions === undefined) {
            $.ajax('http://www.youtube.com/get_video_info?video_id=' + item.id + '&el=embedded', {'async': false})
            .success(function (res) {
              if (res.substr(0, 11) != 'status=fail') {
                self.addVideoSlide(item.id, item.duration);
                resultCounter++;
              }
            });
          }
        });
      });
    return resultCounter;
  }

  return YouTubeSlideGenerator;
});
