define(['lib/jquery', 'eic/generators/BaseSlideGenerator', 'eic/TTSService'],
function ($, BaseSlideGenerator, TTSService) {
  "use strict";
  
  /*
   * CLEANUP
   * Add Path
   **/

  /** Generator that creates outroductory slides */
  function OutroductionSlideGenerator(startTopic, endTopic, duration) {
    if (!startTopic)
      throw "The OutroductionSlideGenerator has no starttopic";

    BaseSlideGenerator.call(this);
    
    this.startTopic = startTopic;
    this.endTopic = endTopic;
    this.duration = duration || 1000;
  }

  $.extend(OutroductionSlideGenerator.prototype,
           BaseSlideGenerator.prototype,
  {
      init: function () {
        if (!this.inited) {
          var self = this;
          self.createSpeech();
          this.inited = true;
        }
      },

      /** Checks whether the outro slide has been shown. */
      hasNext: function () {
        return this.done !== true;
      },

      getDuration: function () {return this.duration;},
      
      /** Advances to the outro slide. */
      next: function () {
        if (!this.hasNext())
          return;
        
        var self = this,
            $outro = $('<h1>').text("As you can see, "),
            slide = this.createBaseSlide('outro', $outro, this.duration);
        slide.once('started', function () {
          setTimeout(function () {
            $outro.append($('<span>').text(self.startTopic.label || self.startTopic.first_name + ','));
            setTimeout(function () {
              $outro.append($('<br>'));
              $outro.append((self.startTopic.first_name ? "you are " : "is ") + "connected to everything in this world,");
              setTimeout(function () {
                $outro.append($('<br>'));
                $outro.append("including ");
                $outro.append($('<span>').text(self.endTopic.label));
                $outro.append("!");
                setTimeout(function () {
                  addNavigation($outro.parent());
                  addShares($outro.parent(), self);
                }, 2000);
              }, 1000);
            }, 500);
          }, 1000);
        });
        slide.audioURL = this.audioURL;
        
        this.done = true;

        return slide;
      },
      
      createSpeech: function () {
        var tts = new TTSService(),
            self = this;
        
        var text = "So as you can see, " +
                   (this.startTopic.first_name || this.startTopic.label) +
                   (this.startTopic.first_name ? ", you are " : " is ") + "connected to everything in this world," +
                   "including " + this.endTopic.label + "!";
        
        tts.getSpeech(text, 'en_GB', function (response) {
          self.audioURL = response.snd_url;
        });
      }
    });
  
  function addNavigation($container){
    var $nav = $('<div />')
    .addClass('navigation')
    .appendTo($container);
    
    $('<span>')
    .addClass('button')
    .appendTo($nav)
    .click(function(){
      window.location.reload();
    })
    .text('Try again!');
    
//    $('<span>')
//    .addClass('button')
//    .appendTo($nav)
//    .click(function(){
//      
//    })
//    .text('Disconnect from Facebook');
    
  }
  
  function addShares($container, self) {
    var $buttons = $('<div>', {'class': 'share'});
    $container.append($('<h2>').text('Share:'), $buttons);
    
    /** Add Facebook button */
//    var $fblike = $('<div>').addClass("fb-like")
//                            .attr('data-href', "OUR URL")
//                            .attr('data-send', " false")
//                            .attr('data-layout', "button_count")
//                            .attr('data-width', "112")
//                            .attr('data-show-faces', "true");
//    $buttons.append($('<div>', { 'class': 'facebook' }).append($fblike));
//    // Render the button (Facebook API is already loaded)
//    window.FB.XFBML.parse();

    /** Add Tweet button */
    var tweetmessage = (self.startTopic.first_name ? 'I am ' : self.startTopic.label + ' is ') + 'connected to '+self.endTopic.label+' through #LinkedData! Find out how you are #connected at http://everythingisconnected.be. #iswc2012';
    
    var $tweet = $('<a>')
    .attr('href', 'https://twitter.com/share?text=' + tweetmessage)
                         .attr('data-lang', "en")
                         .addClass("twitter-share-button")
                         .text("Tweet")
                         .attr('url', "OUR URL");
    $buttons.append($('<div>', {'class': 'twitter'}).append($tweet));
    // Render the button
    $.getScript("https://platform.twitter.com/widgets.js");

    /** Add Google Plus button */
    // Make sure the metadata is right
//    $('html').attr('itemscope', "")
//             .attr('itemtype', "http://schema.org/Demo");
//    $('head').append($('<meta>').attr('itemprop', "name")
//                                .attr('content', "Everything is connected"));
//    $('head').append($('<meta>').attr('itemprop', "name")
//                                .attr('content', "A demonstrator to show how everything is connected."));
//
//    var $gplus = $('<div>').addClass("g-plusone")
//                           .attr('data-size', "medium")
//                           .attr('data-href', "OUR URL");
//    $buttons.append($('<div>', { 'class': 'googleplus' }).append($gplus));
//    // Render the button
//    $.getScript("https://apis.google.com/js/plusone.js");
  }

  return OutroductionSlideGenerator;
});
