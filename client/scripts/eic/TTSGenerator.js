define(['lib/jquery','lib/jvent'],
  function ($,EventEmitter){
    "use strict";
    
    function TTSGenerator(){
      EventEmitter.call(this);
            
      this.VOICE_LIST = new Array();
      VOICE_LIST["ar_SA"] = "leila22k";
      VOICE_LIST["ca_ES"] = "laia22k";
      VOICE_LIST["cs_CZ"] = "eliska22k";
      VOICE_LIST["da_DK"] = "mette22k";
      VOICE_LIST["nl_BE"] = "sofie22k";
      VOICE_LIST["nl_NL"] = "daan22k";
      VOICE_LIST["en_IN"] = "deepa22k";
      VOICE_LIST["en_GB"] = "rachel22k";
      VOICE_LIST["en_US"] = "heather22k";
      VOICE_LIST["fi_FI"] = "sanna22k";
      VOICE_LIST["fr_BE"] = "justine22k";
      VOICE_LIST["fr_CA"] = "louise22k";
      VOICE_LIST["fr_FR"] = "alice22k";
      VOICE_LIST["de_DE"] = "andreas22k";
      VOICE_LIST["el_GR"] = "dimitris22k";
      VOICE_LIST["it_IT"] = "chiara22k";
      VOICE_LIST["no_NO"] = "bente22k";
      VOICE_LIST["pl_PL"] = "ania22k";
      VOICE_LIST["pt_BR"] = "marcia22k";
      VOICE_LIST["pt_PT"] = "celia22k";
      VOICE_LIST["ru_RU"] = "andreas22k";
      VOICE_LIST["sc_SE"] = "mia22k";
      VOICE_LIST["es_ES"] = "antonio22k";
      VOICE_LIST["es_US"] = "rosa22k";
      VOICE_LIST["sv_SE"] = "elin22k";
      VOICE_LIST["sv_FI"] = "samuel22k";
      VOICE_LIST["gb_SE"] = "kal22k";
      VOICE_LIST["tr_TR"] = "ipek22k";
    }
    
    TTSGenerator.prototype = {
      retrieveVoice:function (lang){
        if (VOICE_LIST[lang]){
          return VOICE_LIST[lang];
        }
        return VOICE_LIST['en_GB'];
      },
      getSpeech: function (text,lang){
        var self = this;
        
        $.ajax({
          url: 'http://vaas.acapela-group.com/webservices/1-32-01-JSON/synthesizer.php?jsoncallback=?',
          type: 'GET', 
          data: {
            prot_vers: 2, 
            cl_login: "EVAL_VAAS", 
            cl_app: "EVAL_9289549", 
            cl_pwd: "veuoqce4", 
            req_voice: this.retrieveVoice(lang), 
            req_text:text         
          },
          dataType: 'jsonp',
          success: function(data){
            if (data.res == 'OK'){
              self.emit('speechReady',data);
            } else {
              self.emit('speechError',data);
            }
          },
          error: function(error){
            self.emit('speechError',data);
          }
        });    
      }
    }
    
    return TTSGenerator;
  });


