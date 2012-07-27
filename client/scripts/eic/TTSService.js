define(['lib/jquery', 'lib/jvent'],
  function ($, EventEmitter) {
    "use strict";
    
    var local = false;
    var server = local ? 'restdesc.org:5555' : 'vaas.acapela-group.com';

    function TTSService() {
      EventEmitter.call(this);

      this.VOICE_LIST = {
        "ar_SA" : "leila22k",
        "ca_ES" : "laia22k",
        "cs_CZ" : "eliska22k",
        "da_DK" : "mette22k",
        "nl_BE" : "sofie22k",
        "nl_NL" : "daan22k",
        "en_IN" : "deepa22k",
        'en_GB' : 'ryan22k',
        'en_US' : 'heather22k',
        'fi_FI' : 'sanna22k',
        'fr_BE' : 'justine22k',
        'fr_CA' : 'louise22k',
        'fr_FR' : 'alice22k',
        'de_DE' : 'andreas22k',
        'el_GR' : 'dimitris22k',
        'it_IT' : 'chiara22k',
        'no_NO' : 'bente22k',
        'pl_PL' : 'ania22k',
        'pt_BR' : 'marcia22k',
        'pt_PT' : 'celia22k',
        'ru_RU' : 'andreas22k',
        'sc_SE' : 'mia22k',
        'es_ES' : 'antonio22k',
        'es_US' : 'rosa22k',
        'sv_SE' : 'elin22k',
        'sv_FI' : 'samuel22k',
        'gb_SE' : 'kal22k',
        'tr_TR' : 'ipek22k'
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
              console.log('Audio URL ' + data.snd_url+ ' was fetched!');
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