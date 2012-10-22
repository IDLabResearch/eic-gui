define(['lib/jquery', 'lib/jvent'],
  function ($, EventEmitter) {
    "use strict";

    var local = false;
    var server = local ? 'restdesc.org:5555' : 'vaas.acapela-group.com';

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
        console.log('Requesting audio URL...');
        $.ajax({
          url: 'http://' + server + '/webservices/1-32-01-JSON/synthesizer.php?jsoncallback=?',
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
              console.log('Audio URL ' + data.snd_url + ' was fetched!');
              self.emit('speechReady', data);
            }
            else {
              console.log(data.err_code);
              self.emit('speechError', data);
            }
          },
          error: function (error) {
            self.emit('speechError', error);
          }
        });
      }
    };

    return TTSService;
  });
