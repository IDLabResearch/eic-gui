/*jshint browser: true*/

define([ 'lib/jquery',
    'eic/generators/BaseSlideGenerator',
    'eic/TTSService', 'eic/FacebookConnector', 'lib/jvent'],
function ($, BaseSlideGenerator, TTSService, FacebookConnector, EventEmitter) {

  "use strict";

  var defaultDuration = 1000;

  /** Generator that creates outroductory slides */
  function OutroductionSlideGenerator(startTopic, endTopic, duration) {
    if (startTopic.type !== 'facebook')
      throw "The OutroductionSlideGenerator only works with start topics that are Facebook profiles.";

    this.fbConnector = new FacebookConnector();
    
    BaseSlideGenerator.call(this);
    this.slides = [];
    this.startTopic = startTopic;
    this.endTopic = endTopic;
    this.duration = duration || defaultDuration;
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

      getDuration: function () { return this.duration; },
      
      /** Advances to the outro slide. */
      next: function () {
        if (!this.hasNext())
          return;

        var startTopic = this.startTopic,
            endTopic = this.endTopic,
            slide = this.createOutroSlide('outro', this.duration);

        this.done = true;

        return slide;
      },
      
      createOutroSlide: function (cssClass, duration) {
        var startTopic = this.startTopic,
            endTopic = this.endTopic;

        var $outro = $('<h1>').text("As you can see, "),
            slide = this.createBaseSlide('outro', $outro, duration);
        
        slide.once('started', function () {
          setTimeout(function () {
            $outro.append($('<span>').text(startTopic.first_name + ", "));
            setTimeout(function () {
              $outro.append($('<br>'));
              $outro.append("you are connected to everything in this world,");
              setTimeout(function () {
                $outro.append($('<br>'));
                $outro.append("including ");
                $outro.append($('<em>').text(endTopic.label));
                $outro.append("!");
                setTimeout(function () {
                  addShares($outro.parent());
                }, 2000);
              }, 1000);
            }, 500);
          }, 1000);
        });
        
        slide.audioURL = this.audioURL;

        return slide;
      },
      
      createSpeech: function () {
        var tts = new TTSService(),
            self = this;
        
        var text = "So as you can see, " +
                   this.startTopic.first_name + ", " +
                   "you are connected to everything in this world," +
                   "including " + this.endTopic.label + "!";
        
        tts.getSpeech(text, 'en_GB', function (response) {
          self.audioURL = response.snd_url;
        });
      }
    });

  function addShares($container) {
    $container.append($('<p>').append($('<br>'))
                              .append($('<br>'))
                              .append($('<br>'))
                              .append($('<br>'))
                              .append($('<br>'))
                              .append($('<br>')));
    
    var $buttons = $('<div>', { 'class': 'share' });
    $container.append($('<h2>').text('Share:'), $buttons);
    
    /** Add Facebook button */
    var $fblike = $('<div>').addClass("fb-like")
                            .attr('data-href', "OUR URL")
                            .attr('data-send', " false")
                            .attr('data-layout', "button_count")
                            .attr('data-width', "112")
                            .attr('data-show-faces', "true");
    $buttons.append($('<div>', { 'class': 'facebook' }).append($fblike));
    // Render the button (Facebook API is already loaded)
    window.FB.XFBML.parse();

    /** Add Tweet button */
    var $tweet = $('<a>').attr('href', "https://twitter.com/share")
                         .attr('data-lang', "en")
                         .addClass("twitter-share-button")
                         .text("Tweet")
                         .attr('url', "OUR URL");
    $buttons.append($('<div>', { 'class': 'twitter' }).append($tweet));
    // Render the button
    addTweetButton();

    /** Add Google Plus button */
    // Make sure the metadata is right
    $('html').attr('itemscope', "")
             .attr('itemtype', "http://schema.org/Demo");
    $('head').append($('<meta>').attr('itemprop', "name")
                                .attr('content', "Everything is connected"));
    $('head').append($('<meta>').attr('itemprop', "name")
                                .attr('content', "A demonstrator to show how everything is connected."));

    var $gplus = $('<div>').addClass("g-plusone")
                           .attr('data-size', "medium")
                           .attr('data-href', "OUR URL");
    $buttons.append($('<div>', { 'class': 'googleplus' }).append($gplus));
    // Render the button
    addGPlusButton();
  }

  function addTweetButton() {
    $.getScript("https://platform.twitter.com/widgets.js");
  }

  function addGPlusButton() {
    $.getScript("https://apis.google.com/js/plusone.js");
  }

  return OutroductionSlideGenerator;
});
