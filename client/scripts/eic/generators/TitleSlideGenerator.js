/*!
 * EIC TitleSlideGenerator
 * Copyright 2012, Multimedia Lab - Ghent University - iMinds
 * Licensed under GPL Version 3 license <http://www.gnu.org/licenses/gpl.html> .
 */
define(['lib/jquery', 'eic/generators/BaseSlideGenerator', 'eic/PiecesUI'],
  function ($, BaseSlideGenerator, PiecesUI) {
    "use strict";

    /*
   * EXTEND
   * CLEANUP
   **/

    var defaultDuration = 1500;

    /** Generator that creates a title slide for a topic. */
    function TitleSlideGenerator(topic, duration) {
      BaseSlideGenerator.call(this);
      if (typeof topic === "string")
        topic = {
          label: topic
        };

      this.topic = topic;
      this.duration = duration || defaultDuration;
    }

    $.extend(TitleSlideGenerator.prototype,
      BaseSlideGenerator.prototype,
      {
        /** Checks whether the title slide has been shown. */
        hasNext: function () {
          return this.done !== true;
        },

        /** Advances to the title slide. */
        next: function () {
          if (!this.hasNext())
            return;

          var $title = $('<div />').addClass('title');

          var $content = $('<div />')
          .addClass('content')
          .appendTo($title);

          $('<div />').addClass('pieces').appendTo($title);

          var slide = this.createBaseSlide('titleSlide', $title, this.duration);

          var pieceWidth = 350;
          var labels = [
            this.topic.previous || '',
            this.topic.label
          ];
          for (var i = 0; i < labels.length; i++) {
            var piece = PiecesUI.prototype.drawPiece($title, {
              x: i,
              y: 0,
              size: pieceWidth,
              scaleX: 1,
              scaleY: (1 - 2 * (i % 2)),
              img: i === 1 ? 'images/piece5.svg' : 'images/piece6.svg'
            })
            .attr('id', 'title_piece_' + i);

            piece.css('display', labels[i] ? 'block' : 'none');

            $('<div />')
            .appendTo($content)
            .text(labels[i])
            .css({
              position: 'absolute',
              left: i * pieceWidth,
              'margin-top': pieceWidth - (pieceWidth * 0.22) - 20,
              'margin-left': (pieceWidth * 0.22) * (1 - i),
              width: pieceWidth - (pieceWidth * 0.22),
              'font-size':   pieceWidth / 8,
              'line-height': 1,
              'text-align': 'left'
            })
            .attr('id', 'title_label_' + i);
          }

          slide.once('started', function () {
            $('#title_piece_1, #title_label_1')
            .css({

              'animation-name': 'slide2',
              'animation-duration': '0.5s',
              'transition-timing-function': 'linear'
            });
          });

          this.done = true;

          return slide;
        }
      });

    return TitleSlideGenerator;
  });
