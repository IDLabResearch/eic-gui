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
        this.drawPieces($('#play'), 1, 'images/piece1.svg', 100);
        
        $('#frame').show();
      
        this.drawBigPieces($('#steps'));
    
        var self = this;
        this.initControls();
        this.facebookConnector.init();

        // Select the topic when the user connects to Facebook
        this.facebookConnector.once('connected', function (event, profile) {
          self.profile = profile;
          self.topicSelector.selectTopic().then(
            function (startTopic) {
              self.intro = new IntroductionSlideGenerator(profile, startTopic);
              self.intro.init();
              self.beginTopic = startTopic;
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

          this.drawPiece($title, {
            x: i, 
            y: 0, 
            size: this.width, 
            scaleY: (1 - 2 * (i % 2)), 
            img: img
          });


          var $content = $title
          .children('.content');
          $content.css({
            'margin-top': fontsize ? (this.width - fontsize) / 2 + 10 : 10,
            'margin-left': fontsize ? 30 : 0.22 * this.width,
            'font-size':   fontsize || this.width
          });
        }
      },
      drawPiece: function ($elem, options) {
        var x =  options.x * (options.size - 0.22 * options.size) + ((1 - (options.y % 2)) * 0.215 * options.size),
        y = options.y * (options.size - 0.22 * options.size) + ((options.x % 2) * 0.215 * options.size);
        
        $elem
        .width(x + options.size)
        .height(options.size);
                    
        return $('<div />')
        .addClass('piece')
        .css({
          width: options.size,
          height: options.size,
          position: 'absolute',
          left: x,
          top: y,
          '-webkit-transform': 'scale(' + (options.scaleX || 1) + ','  + (options.scaleY || 1) + ')',
          'background': 'url(' + options.img + ') no-repeat',
          'background-size': '100% 100%'
        })
        .appendTo($elem.children('.pieces'));
      },
      drawBigPieces: function ($title) {
        var new_width = this.width * 4;
        var step = 1;
   
        for (var i = 0; i < 2; i++) {
          for (var j = 0; j < 2; j++) {
         
            var piece = this.drawPiece($title, {
              x: i, 
              y: j, 
              size: new_width, 
              scaleX: (1 - 2 * (j % 2)),
              scaleY: (1 - 2 * (i % 2)), 
              img: (i == 0 && j == 1)?'images/piece4.svg':'images/piece3.svg'
            })
            .attr('id', 'piece_' + step)
            .hide();
            
            $('#step_' + step).css({
              display: 'none',
              left: piece.css('left'),
              top: piece.css('top'),
              'margin-left': new_width * 0.22,
              'margin-top': new_width * 0.22,
              width: new_width - 2 * (new_width * 0.22) - 10
            });
           
            step++;
          }
        }
        
        //Some fixes adjusting the last step
        $('#step_4').css({
          'margin-left': new_width * 0.215 + 40,
          'margin-top': new_width * 0.215,
          width: new_width - 2 * (new_width * 0.22) - 40
        });
      },
      disableElement: function($elem, disabled) {
        if (disabled) 
          $elem
          .addClass('disabled')
          .prop("disabled", true);
        else 
          $elem
          .removeClass('disabled')
          .prop("disabled", false);
      },
      animate: function ($elem, name, duration, callback){
        if (callback)
          window.setTimeout(callback, duration*1000);
          
        return $elem.css({
          '-webkit-animation-name': name,
          '-webkit-animation-duration': duration + 's',
          '-webkit-transition-timing-function': 'linear'
        });
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
          $('#step_1').hide();
          
          self.animate($('#piece_1'), 'rotatein', 0.3, 
            function () {
              $('#play').show();
              $('#piece_1').hide();
            });
        });
        
        //Shows the stepsmenu
        $('#play').mouseover(function () {
          $(this).hide();
          
          self.animate($('#piece_1'), 'rotateout', 0.3, 
            function () {
              $('#step_1').show();
            })
          .show();
        });
        
        $('#step_1 .next:not(.disabled)').live('click', function () {
          self.disableElement($('#step_1 .button, #step_1 input'), true);
          self.disableElement($('#step_3 .back'), false);
         
          self.animate($('#steps'),'rotate1to2',0.3)
          .css({
            'left': -200,
            'top': 250,
            '-webkit-transform': 'rotate(-95deg)'
          });
          
          self.animate($('#piece_3, #step_3'), 'slide2', 0.5)
          .show();
        });
        
        $('#step_3 .back:not(.disabled)').live('click', function () {
          self.disableElement($('#step_1 .button, #step_1 input'), false);
          
          self.animate($('#steps'), 'rotate2to1', 0.3,
            function () {
              $('#piece_3, #step_3').hide();
            })
          .css({
            'left': 0,
            'top': 0,
            '-webkit-transform': 'rotate(-5deg)'
          });
          
          self.animate($('#piece_3, #step_3'), 'slide2rv', 0.5);
        });

        $('#step_3 .next:not(.disabled)').live('click',
          function () {
            self.disableElement($('#step_3 .button, #step_3 input'), true);
            self.disableElement($('#step_4 .back'), false);
            
            self.animate($('#steps'), 'rotate2to3', 0.3)
            .css({
              'left': 350,
              'top': -200,
              '-webkit-transform': 'rotate(95deg)'
            });
          
            self.animate($('#piece_4, #step_4'), 'slide3',0.5)
            .show();
          });
        
        $('#step_4 .back:not(.disabled)').live('click',
          function () {
            self.disableElement($('#step_3 .button, #step_3 input'), false);
            
            self.animate($('#steps'), 'rotate3to2', 0.3, 
              function () {
                $('#piece_4, #step_4').hide();
              })
            .css({
              'left': -200,
              'top': 250,
              '-webkit-transform': 'rotate(-95deg)'
            });
          
            self.animate($('#piece_4, #step_4'), 'slide3rv', 0.5);         
          });
        
        $('.play_button').click(function () {
          self.drawScreen($('#screen'));
        });
       
        var fbContent = $('#facebook').html();

        // Initialize the controls of each step.
        $('#facebook-connect').live('click', $.proxy(this, 'connectToFacebook'));
        
        $('#begintopic').on('change keyup', $.proxy(this, 'updateBeginTopic'));
        $('#endtopic').on('change keyup', $.proxy(this, 'updateEndTopic'));

        // Make sure the topic is empty (browsers can cache text).
        $('#begintopic').val('');
        $('#endtopic').val('');

        autocompleteTopic($('#begintopic'));
        autocompleteTopic($('#endtopic'));

        // Don't let empty links trigger a location change.
        $('a[href=#]').prop('href', 'javascript:;');

        // Update the controls when the user connects to Facebook
        self.facebookConnector.once('connected', function (event, profile) {
          $('#begintopic').hide();
          // Update connection status.
          $('#facebook').empty().append(
            'Connected as <span class="profile_name">' + profile.name + '</span> <br>',
            $('<a>', {
              text: 'Disconnect',
              click: function () {
                self.facebookConnector.disconnect(
                  //$.proxy(window.location, 'reload')
                  $.proxy(function(){
                    $('#begintopic').show();
                    self.disableElement($('#step_1 .next'), true);
                    $('#facebook').html(fbContent);
                    delete self.intro;
                    delete self.profile;
                  })
                  );
                return false;
              }
            }).attr('id', 'facebook-connect'));

          // Enable second step.
          self.disableElement($('#step_1 .next'), false);
        });
      },
      // Lets the user connect with a Facebook account.
      connectToFacebook: function () {
        //$('#facebook').text('Connecting…');
        this.facebookConnector.connect();
      },
      // Updates the start topic.
      updateBeginTopic: function () {
        this.beginTopic = {
          label: $('#begintopic').val(),
          uri: $('#begintopic').data('uri') || ''
        };
        var valid = this.beginTopic.uri.length > 0;
        //Enable second step if the topic is valid.
        this.disableElement($('#step_1 .next'), !valid);
      },
      // Updates the goal topic.
      updateEndTopic: function () {
        this.endTopic = {
          label: $('#endtopic').val(),
          uri: $('#endtopic').data('uri') || ''
        };
        var valid = this.endTopic.uri.length > 0;

        //Enable third step if the topic is valid.
        this.disableElement($('#step_3 .next'), !valid);
      },
      drawScreen: function ($screen) {
        var self = this;
        $screen.show();
                
        this.animate($('#piece_2'), 'drop', 0.3)
        .show();
        
        this.animate($('#steps'),'moveToScreen', 0.7,
          function () {
            $('#frame').remove();
            self.playMovie();
          })
        .css({
          width: '0px',
          height: '0px',
          left: -3 * 0.88 * this.width - 5,
          top:  400 - (this.width * 8 * 2),
          '-webkit-transform': 'rotate(0deg) scale(3, 3)'
        });
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

        if (this.intro)
          this.generator.addGenerator(this.intro);
        
        this.topicToTopic = new TopicToTopicSlideGenerator(this.beginTopic);
        this.generator.addGenerator(this.topicToTopic);
        this.topicToTopic.setEndTopic(this.endTopic);

        this.generator.addGenerator(new OutroductionSlideGenerator(this.profile || this.beginTopic, this.endTopic));

        // Start the slide show.
        var presenter = new SlidePresenter($slides, this.generator, $audio);
        presenter.start();
      }
    }

    return Application;
  });
