define(['lib/jquery'],
  function ($) {
    "use strict";
  
    function drawPiece($elem, options) {
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
    };

    return drawPiece;
  });
