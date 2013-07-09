/*!
 * EIC TTSService
 * Copyright 2012, Multimedia Lab - Ghent University - iMinds
 * Licensed under GPL Version 3 license <http://www.gnu.org/licenses/gpl.html> .
 */
define(['lib/jquery', 'eic/Logger', 'lib/jvent', 'config/URLs'],
  function ($, Logger, EventEmitter, urls) {
    "use strict";
    var logger = new Logger("TTSService");

    function TTSService() {
      EventEmitter.call(this);
    }

    TTSService.prototype = {
      getSpeech: function (text, lang, callback) {
        var self = this;
        logger.log('Requesting audio URL');
        $.ajax({
          url: urls.speech,
          type: 'GET',
          data: { req_text: text },
          dataType: 'jsonp',
          success: function (data) {
            if (data.res === 'OK') {
              if (callback)
                callback(data);
              logger.log('Received audio URL', data.snd_url);
              self.emit('speechReady', data);
            }
            else {
              logger.log('Error receiving speech', data.err_code);
              self.emit('speechError', data);
            }
          },
          error: function (error) {
            logger.log('Error receiving speech', error);
            self.emit('speechError', error);
          }
        });
      }
    };

    return TTSService;
  });
