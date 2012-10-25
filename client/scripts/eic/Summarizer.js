define(['lib/jquery'], function ($) {
  "use strict";
  
  /*
   * CLEANUP
   **/

  function Summarizer() {
    this.result = {
      topics : [],
      links : []
    };
  }

  Summarizer.prototype = {
    summarize : function (data) {

      console.log('Summarization has started!');

      var paths = data.paths[0];
      var self = this;

      /**
       * Generate the result formatted as the 'test' .json
       */
      function formatResult(result) {
        for (var i = 1; i < result.topics.length; i++) {
          var glue = '';
          var sentence = result.links[i - 1][Math.round(Math.random())];
          switch (sentence.type) {
            case 'direct':
              glue = result.topics[i - 1].topic.label + sentence.value + result.topics[i].topic.label + '. ';
              break;
            case 'indirect':
              glue = result.topics[i].topic.label + sentence.value + result.topics[i - 1].topic.label + '. ';
              break;
          }
          result.topics[i].text = glue + result.topics[i].text;
        }

        return {
          steps: result.topics
        };
      }

      function retrieveTranscription(index, edge) {
        var  property = edge.substr(edge.lastIndexOf('/') + 1);
        console.log('Extracting sentence for ' + edge);
        //Split the string with caps
        var parts = property.match(/([A-Z]?[^A-Z]*)/g).slice(0, -1);

        if (parts[0] === 'has' || parts[0] === 'is') {
          parts.shift();
        }

        var sentence = [
        {
          type: 'direct',
          value: '\'s ' + decodeURIComponent(parts.join(' ').toLowerCase()) + ' is '
        },
        {
          type: 'indirect',
          value: '\'s the ' + decodeURIComponent(parts.join(' ').toLowerCase()) + ' of '
        }
        ];
        
        self.result.links[index] = sentence;


        if ((self.result.topics.length  == paths.vertices.length) && (self.result.links.length == paths.edges.length)) {
          $(self).trigger('generated', formatResult(self.result));
        }

        console.log('Property: ' + property);
        console.log('Generated sentence '+index+': ' + self.result.links[index][0].value);
      }

      function retrieveAbstracts(vertices) {
        var url = 'http://pathfinding.restdesc.org/descriptions'
      
        $.ajax({
          url: url,
          dataType: 'json',
          data: {
            uri: vertices.join(',')
          },
          success: function (abstracts) {
            if (abstracts.length === 0)
              console.log('No abstracts found!');
            
            for (var i = 0;j<vertices.length;i++){
              var tregex = /\n|([^\r\n.!?]+([.!?]+|$))/gim;
              var sentences = abstracts[vertice].match(tregex);
              var desc = '';
              
              for (var j = 0;j<sentences.length;j++){
                desc += sentences[j];
                if (j > 2)
                  break;
              }              
              self.result.topics[i] = {
                topic : {
                  type: 'person',
                  label: abstracts[vertice].label
                },
                text : desc
              };
            }

            if (self.result.links.length == paths.edges.length) {
                $(self).trigger('generated', formatResult(self.result));
            }

            console.log('Resource: ' + vertice);
            console.log('Extracted text: ' + desc);
          },
          error: function (err) {
            console.log('Error retrieving abstracts: ' + err);
          }
        });
      }
      
      
      retrieveAbstracts(paths.vertices);
      $(paths.edges).each(retrieveTranscription);
    }
  };
  return Summarizer;
});



