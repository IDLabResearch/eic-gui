define(['lib/jquery'], function ($) {
  "use strict";

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
          console.log(result.topics[0]);
          console.log(result.links);
          result.topics[i].text = glue + result.topics[i].text;
        }

        return {
          steps: result.topics
        };
      }
      
      function retrieveAbstract(index, vertice) {
        var endpoint = 'http://dbpedia.org/sparql?query=';
        //var endpoint = 'http://restdesc.elis.ugent.be:8891/sparql?default-graph-uri=&query=';
        var query = 'SELECT ?label ?desc where { <' + vertice + '> rdfs:comment ?desc; rdfs:label ?label . FILTER(langMatches(lang(?desc), "EN")). FILTER(langMatches(lang(?label), "EN")) } limit 1';
        
        console.log('Executing SPARQL Query for ' + vertice);

        $.ajax({
          url: endpoint,
          dataType: 'jsonp',
          data: {
            query: query,
            format: 'application/sparql-results+json'
          },
          contentType: 'application/sparql-results+json',
          success: function (res) {
            console.log('SPARQL result: ' + res);
            var label = res.results.bindings[0].label;
            var desc = res.results.bindings[0].desc;
        
            //Unique ID will be required!! Supply with path
            var id = paths.vertices.indexOf(vertice);
               
            self.result.topics[id] = {
              topic : {
                type: 'person',
                label: label.value
              },
              text : desc.value
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


   