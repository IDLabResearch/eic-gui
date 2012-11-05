define(['lib/jquery', 'eic/AutocompleteTopic', 'eic/FacebookConnector',
  'eic/generators/IntroductionSlideGenerator', 'eic/generators/OutroductionSlideGenerator',
  'eic/generators/TopicToTopicSlideGenerator', 'eic/generators/CombinedSlideGenerator',
  'eic/generators/ErrorSlideGenerator',
  'eic/SlidePresenter', 'eic/TopicSelector'],
  function ($, autocompleteTopic, FacebookConnector,
    IntroductionSlideGenerator, OutroductionSlideGenerator,
    TopicToTopicSlideGenerator, CombinedSlideGenerator,
    ErrorSlideGenerator,
    SlidePresenter, TopicSelector) {
    "use strict";
  
    function Application(){
      this.width = 120;
      
      this.facebookConnector = new FacebookConnector();
      this.topicSelector = new TopicSelector(this.facebookConnector);
      this.generator = new CombinedSlideGenerator();
    }
  
    Application.prototype = {
      init: function(){
        this.drawPieces($('#title_1'), 5, 'images/piece3.svg');
        this.drawPieces($('#title_2'), 1, 'images/piece2.svg');
        this.drawPieces($('#title_3'), 5, 'images/piece3.svg');
        this.drawPieces($('#play'), 1, 'images/piece1.svg', 80);
      
        this.drawBigPieces($('#steps'));
    
        var self = this;
        this.initControls();
        this.facebookConnector.init();

        // Select the topic when the user connects to Facebook
        this.facebookConnector.once('connected', function (event, profile) {
          self.profile = profile;
          self.topicSelector.selectTopic().then(
            function (startTopic) {
              // add introduction generator
              self.generator.addGenerator(new IntroductionSlideGenerator(profile, startTopic));

              // add topic-to-topic generator
              self.topicToTopic = new TopicToTopicSlideGenerator(startTopic);
              self.generator.addGenerator(self.topicToTopic);
            },
            function (error) {
              self.generator.addGenerator(new ErrorSlideGenerator(error));
            });
        });
    
      },
      drawPieces: function($title, nr, img, fontsize) {
        for (var i = 0; i < nr; i++) {
          var x =  i * (this.width - 0.22 * this.width),
          y = ((i % 2) * 0.215 * this.width);

          $title
          .width(x + this.width)
          .height(this.width);


          $('<div />')
          .addClass('piece')
          .css({
            width: this.width,
            height: this.width,
            position: 'absolute',
            left: x,
            top: y,
            '-webkit-transform': 'scaleY(' + (1 - 2 * (i % 2)) + ')',
            'background': 'url(' + img + ') no-repeat ',
            'background-size': '100% 100%'
          })
          .appendTo($title.children('.pieces'));
          
          var $content = $title
          .children('.content');
          $content.css({
            'margin-top': fontsize ? (this.width - fontsize) / 2 : 10,
            'margin-left': 0.22 * this.width,
            'font-size':   fontsize || this.width
          });
        }
      },
      /*does not work*/
      //    function addAnimation($elem, name, duration, css){
      //      var anim = {
      //        '-webkit-animation-name': name,
      //        '-webkit-animation-duration': duration + 's',
      //        '-webkit-transition-timing-function': 'linear'
      //      }
      //    
      //      $.extend(anim, css);
      //      $elem.css(anim);
      //    }
      drawBigPieces: function ($title) {
        var new_width = this.width * 4;
        var step = 1;
      
   
        for (var i = 0; i < 2; i++) {
          for (var j = 0; j < 2; j++) {
            var x =  i * (new_width - 0.22 * new_width) + ((1 - (j % 2)) * 0.215 * new_width),
            y = j * (new_width - 0.22 * new_width) + ((i % 2) * 0.215 * new_width);
            
            $title
            .width(x + new_width)
            .height(new_width);
            
            $('#step_' + step).css({
              display: 'none',
              left: x,
              top: y,
              'margin-top': 0.22 * new_width - 35,
              'margin-left': 0.22 * new_width,
              width: (new_width - 2 * (0.22 * new_width)) - 10
            });
            

            $('<div />')
            .addClass('piece')
            .attr('id', 'piece_' + step)
            .css({
              display: 'none',
              width: new_width,
              height: new_width,
              position: 'absolute',
              left: x,
              top: y,
              '-webkit-transform': 'scaleY(' + (1 - 2 * (i % 2)) + ') scaleX(' + (1 - 2 * (j % 2)) + ')',
              'background': 'url(images/piece3.svg) no-repeat ',
              'background-size': '100% 100%'
            })
            .appendTo($title.children('.pieces'));
            
            step++;
          }
        }
      },
      disableElement: function($elem, disabled, button) {
        if (disabled) {
          $elem.find(button || '.button').addClass('disabled').removeClass('button_hover');
          $elem.find('input').prop("disabled", true);
        } else {
          $elem.find('.disabled').removeClass('disabled').addClass('button_hover');
          $elem.find('input').prop("disabled", false);
        }
      },
      initControls: function(){
        var new_width = this.width * 4;

        var self = this;

        $('<span />')
        .addClass('close')
        .html('X')
        .css({
          'margin-top': 0.22 * new_width + 5,
          'margin-left': 10
        })
        .appendTo($('#piece_1'))
        .click(function () {
          $('#piece_1')
          .css({
            '-webkit-animation-name': 'rotatein',
            '-webkit-animation-duration': '0.3s',
            '-webkit-transition-timing-function': 'linear'
          });
          $('#step_1').hide();
          window.setTimeout(function () {
            $('#play').show();
            $('#piece_1').hide();
          }, 300);
        });
        
        $('#play').mouseover(function () {
          $(this).hide();
          $('#piece_1')
          .css({
            'display': 'block',
            '-webkit-animation-name': 'rotateout',
            '-webkit-animation-duration': '0.3s',
            '-webkit-transition-timing-function': 'linear'
          });
          
          window.setTimeout(function () {
            $('#step_1').show();
          }, 300);
        });
        
        $('#step_1 .next:not(.disabled)').live('click', function () {
          self.disableElement($('#step_4'), true);
          self.disableElement($('#step_1'), true);
          self.disableElement($('#step_3'), false);
          
          $('#steps')
          .css({
            'left': -200,
            'top': 250,
            '-webkit-transform': 'rotate(-95deg)',
            '-webkit-animation-name': 'rotate1to2',
            '-webkit-animation-duration': '0.3s',
            '-webkit-transition-timing-function': 'linear'
          });
          
          $('#piece_3, #step_3').css({
            'display': 'block',
            '-webkit-animation-name': 'slide2',
            '-webkit-animation-duration': '0.5s',
            '-webkit-transition-timing-function': 'linear'
          });
        });
        
        $('#step_3 .back:not(.disabled)').live('click', function () {
          self.disableElement($('#step_4'), true);
          self.disableElement($('#step_1'), false);
          self.disableElement($('#step_3'), true);
          
          $('#steps')
          .css({
            'left': 0,
            'top': 0,
            '-webkit-transform': 'rotate(-5deg)',
            '-webkit-animation-name': 'rotate2to1',
            '-webkit-animation-duration': '0.3s',
            '-webkit-transition-timing-function': 'linear'
          });
          
          $('#piece_3, #step_3').css({
            '-webkit-animation-name': 'slide2rv',
            '-webkit-animation-duration': '0.5s',
            '-webkit-transition-timing-function': 'linear'
          });
          
          window.setTimeout(function () {
            $('#piece_3, #step_3').hide();
          }, 300);
        });

        $('#step_3 .next:not(.disabled)').live('click',
          function () {
            self.disableElement($('#step_4'), false);
            self.disableElement($('#step_1'), true);
            self.disableElement($('#step_3'), true);
          
            $('#steps')
            .css({
              'left': 350,
              'top': -200,
              '-webkit-transform': 'rotate(95deg)',
              '-webkit-animation-name': 'rotate2to3',
              '-webkit-animation-duration': '0.3s',
              '-webkit-transition-timing-function': 'linear'
            });
          
            $('#piece_4, #step_4').css({
              'display': 'block',
              '-webkit-animation-name': 'slide3',
              '-webkit-animation-duration': '0.5s',
              '-webkit-transition-timing-function': 'linear'
            });
          });
        
        $('#step_4 .back:not(.disabled)').live('click',
          function () {
            self.disableElement($('#step_4'), true);
            self.disableElement($('#step_1'), true);
            self.disableElement($('#step_3'), false);
          
            $('#steps')
            .css({
              'left': -200,
              'top': 250,
              '-webkit-transform': 'rotate(-95deg)',
              '-webkit-animation-name': 'rotate3to2',
              '-webkit-animation-duration': '0.3s',
              '-webkit-transition-timing-function': 'linear'
            });
          
            $('#piece_4, #step_4').css({
              '-webkit-animation-name': 'slide3rv',
              '-webkit-animation-duration': '0.3s',
              '-webkit-transition-timing-function': 'linear'
            });
          
            window.setTimeout(function () {
              $('#piece_4, #step_4').hide();
            }, 300);
          
          });
        
        $('.play_button').click(function () {
          self.drawScreen($('#screen'));
        });
       
        var fbContent = $('#facebook').html();

        // Initialize the controls of each step.
        $('#facebook-connect').click($.proxy(this, 'connectToFacebook'));
        $('#begintopic').on('change keyup', $.proxy(this, 'updateTopic'));
        $('#endtopic').on('change keyup', $.proxy(this, 'updateTopic'));

        // Make sure the topic is empty (browsers can cache text).
        $('#begintopic').val('');
        $('#endtopic').val('');

        autocompleteTopic('#begintopic');
        autocompleteTopic('#endtopic');

        // Don't let empty links trigger a location change.
        $('a[href=#]').prop('href', 'javascript:;');

        // Update the controls when the user connects to Facebook
        self.facebookConnector.once('connected', function (event, profile) {
          $('#begintopic').hide();
          // Update connection status.
          $('#facebook').empty().append(
            'Connected as ' + profile.name + '. <br>',
            $('<a>', {
              text: 'Disconnect',
              click: function () {
                self.facebookConnector.disconnect(
                  $.proxy(window.location, 'reload')
//                  $.proxy(function(){
//                    $('#begintopic').show();
//                    $('#facebook').html(fbContent);
//                  })
                  );
                return false;
              },
            }).attr('id', 'facebook-connect'));

          // Enable second step.

        });
      },
      // Lets the user connect with a Facebook account.
      connectToFacebook: function () {
        $('#facebook').text('Connecting…');
        this.facebookConnector.connect();
      },
      // Updates the goal topic.
      updateTopic: function () {
        this.endTopic = {
          label: $('#endtopic').val(),
          uri: $('#endtopic').data('uri') || ''
        };
        var valid = this.endTopic.uri.length > 0;

        //Enable third step if the topic is valid.
        this.disableElement($('#step_3'), false, 'next');
      },
      drawScreen: function ($screen) {
        $screen.show();
        
        var self = this;
        
        var $overlay = $('<div />')
        .css({
          position: 'absolute',
          width: 800,
          height: 600,
          'background-color': '#FFF',
          opacity: 0
        })
        .appendTo($screen);
        
        
        $('#piece_2').css({
          display: 'block',
          '-webkit-animation-name': 'drop',
          '-webkit-animation-duration': '0.5s',
          '-webkit-transition-timing-function': 'linear',
          'z-index': 999
        });
        
        $('#steps').css({
          width: '0px',
          height: '0px',
          left: (800 - (this.width * 8 * 1.5)) / 2,
          top: (600 - (this.width * 8 * 1.5)) / 2,
          '-webkit-transform': 'rotate(0deg) scale(1.5, 1.5)',
          '-webkit-animation-name': 'moveToScreen',
          '-webkit-animation-duration': '0.5s',
          '-webkit-transition-timing-function': 'linear'
        });

        //After this event, video starts
        window.setTimeout(function () {
          $overlay.css({
            opacity: 1,
            '-webkit-animation-name': 'fadeIn',
            '-webkit-animation-duration': '0.3s',
            '-webkit-transition-timing-function': 'linear'
          });
          window.setTimeout(function (){
            //$.proxy(this, 'playMovie');
            self.playMovie();
          }, 500);
        }, 1000);
      },
      // Starts the movie about the connection between the user and the topic.
      playMovie: function () {
        var $slides = $('<div>').addClass('slides'),
        $audio = $('<div>').addClass('audio'),
        $wrapper = $('<div>').addClass('slides-wrapper')
        .append($slides).append($audio);

        // Hide the main panel.
        $('#screen').append($wrapper);

        // Show the slides panel.
        $slides.hide();
        $wrapper.hide().fadeIn($.proxy($slides, 'fadeIn', 1000));

        // Fix the end topic and create final generators for the slide show
        if (this.topicToTopic)
          this.topicToTopic.setEndTopic(this.endTopic);
        this.generator.addGenerator(new OutroductionSlideGenerator(this.profile, this.endTopic));

        // Start the slide show.
        var presenter = new SlidePresenter($slides, this.generator, $audio);
        presenter.start();
      }
    }

    return Application;
  });
