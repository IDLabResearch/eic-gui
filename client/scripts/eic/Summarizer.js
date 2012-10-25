define(['lib/jquery', 'config/URLs'], function ($, urls) {
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

      function retrieveAbstract(index, vertice) {
        var query = 'SELECT ?label ?desc where { <' + vertice + '> rdfs:comment ?desc; rdfs:label ?label . FILTER(langMatches(lang(?desc), "EN")). FILTER(langMatches(lang(?label), "EN")) } limit 1';
        
        console.log('Executing SPARQL Query for ' + vertice);

        $.ajax({
          url: urls.abstracts,
          dataType: 'json',
          data: {
            query: query,
            format: 'application/json'
          },
          success: function (res) {
            console.log('SPARQL result: ' + res.results.bindings);

            if (res.results.bindings.length === 0)
              console.log('SPARQL result is empty!');

            var label = res.results.bindings[0].label;
            var desc = res.results.bindings[0].desc;

            var tregex = /\n|([^\r\n.!?]+([.!?]+|$))/gim;
            var sentences = desc.value.match(tregex);
            desc = sentences[0] + sentences[1] + sentences[2];

            //Unique ID will be required!! Supply with path
            var id = paths.vertices.indexOf(vertice);

            self.result.topics[id] = {
              topic : {
                type: 'person',
                label: label.value
              },
              text : desc
            };

            if ((self.result.topics.length  == paths.vertices.length) && (self.result.links.length == paths.edges.length)) {
              $(self).trigger('generated', formatResult(self.result));
            }

            console.log('Resource: ' + vertice);
            console.log('Extracted text: ' + desc);
          },
          error: function (err) {
            console.log('SPARQL error: ' + err);
          }
        });
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
        var id =  paths.edges.indexOf(edge);

        self.result.links[id] = sentence;


        if ((self.result.topics.length  == paths.vertices.length) && (self.result.links.length == paths.edges.length)) {
          $(self).trigger('generated', formatResult(self.result));
        }

        console.log('Property: ' + property);
        console.log('Generated sentence: ' + self.result.links[id]);
      }

      $(paths.vertices).each(retrieveAbstract);
      $(paths.edges).each(retrieveTranscription);
    }
  };
  return Summarizer;
});



