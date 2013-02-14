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

      this.VOICE_LIST = {
        "en_IN" : "deepa22k",
        'en_GB' : 'ryan22k',
        'en_US' : 'heather22k',
      };
    }

    TTSService.prototype = {
      retrieveVoice: function (lang) {
        if (this.VOICE_LIST[lang]) {
          return this.VOICE_LIST[lang];
        }
        return this.VOICE_LIST.en_GB;
      },
      getSpeech: function (text, lang, callback) {
        var self = this;
        logger.log('Requesting audio URL');
        $.ajax({
          url: urls.speech,
          type: 'GET',
          data: {
            prot_vers: 2,
            cl_login: "EXAMPLE_ID",
            cl_app: "EXAMPLE_APP",
            cl_pwd: "x0hzls5cqs",
            req_voice: this.retrieveVoice(lang),
            req_text: text
          },
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
