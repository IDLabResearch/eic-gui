"use strict";
var http = require('http'),
sparql = require('sparql'),
events = require("events"),
sys = require('sys');

var result = {
  topics : [], 
  links : []
};

function Summarizer() {
  if(false === (this instanceof Summarizer)) {
    return new Summarizer();
  }
    
  events.EventEmitter.call(this);
  this.result = [];
}
sys.inherits(Summarizer, events.EventEmitter);

Summarizer.prototype.summarize = function (req, res) {
  console.log('Summarization has started!');
  
  var self = this;
  
  var from = req.param('from'),
  to = req.param('to');
  
  var url = "http://pathfinding.restdesc.org/findPath?s1=" + from + "&s2=" + to;
  http.get(url, function (response) {
    var str = '';

    //another chunk of data has been recieved, so append it to `str`
    response.on('data', function (chunk) {
      str += chunk;
    });

    //the whole response has been recieved, so we just print it out here
    response.on('end', function () {
      var data = JSON.parse(str);
      //TestData
//      var data = {
//        "execution_time": 9100,
//        "paths": {
//          "vertices": [
//          'http:\/\/dbpedia.org\/resource\/David_Guetta',
//          'http:\/\/dbpedia.org\/resource\/Chris_Willis',
//          'http:\/\/dbpedia.org\/resource\/United_States',
//          'http:\/\/dbpedia.org\/resource\/Chicago_Theatre'
//          ],
//          "edges": [
//          'http:\/\/dbpedia.org\/ontology\/associatedMusicalArtist',
//          'http:\/\/dbpedia.org\/property\/birthPlace',
//          'http:\/\/dbpedia.org\/property\/place'
//          ]
//        }
//      }
      function retrieveAbstract(vertice) {
 
        var client = new sparql.Client('http://dbpedia.org/sparql');
  
        var query = 'select ?label ?desc where { <' + vertice + '> rdfs:comment ?desc; rdfs:label ?label . FILTER(langMatches(lang(?desc), "EN")). FILTER(langMatches(lang(?label), "EN")) } limit 1';
        console.log('Executing SPARQL Query for ' + vertice)
        client.query(query, 
          function (err,res) {
            if (err)
              console.log('SPARQL error: ' + err);
            else {
              var label = res.results.bindings[0].label;
              var desc = res.results.bindings[0].desc;
        
              //Unique ID will be required!! Supply with path
              //var id = data.paths.vertices.indexOf(vertice) * 2;
              var id = data.paths.vertices.indexOf(vertice)
               
              result.topics[id] = {
                topic : {
                  type: 'person',
                  label: label.value
                },
                text : desc.value
              };
              
              if ((result.topics.length  == data.paths.vertices.length) && (result.links.length == data.paths.edges.length)) {
                self.emit('generated',result);
              }
            }
          });
    
    
        console.log('Node: ' + vertice);
        console.log('Extracted text: ' + result[vertice]);
      };

      function retrieveTranscription(edge) {
        var  property = edge.substr(edge.lastIndexOf('/') + 1);
  
        //Split the string with caps
        var parts = property.match(/([A-Z]?[^A-Z]*)/g).slice(0,-1);

        if (parts[0].indexOf('has') > -1 || parts[0].indexOf('is') > -1) {
          parts.shift();
        } 
    
        var sentence = '\'s ' + parts.join(' ') + ' is ';
        var id =  data.paths.edges.indexOf(edge);
        result.links[id] = sentence.toLowerCase();
        
        
        if ((result.topics.length  == data.paths.vertices.length) && (result.links.length == data.paths.edges.length)) {
          self.emit('generated',result);
        }
  
        console.log('Property: ' + property);
        console.log('Generated sentence: ' + result.links[id]);
      };
      
      data.paths.vertices.forEach(retrieveAbstract);
      data.paths.edges.forEach(retrieveTranscription);

    });
    return this;
  }).on('error', function (e) {
    console.log("Got error: " + e.message);
  });
  
  console.log('Retrieving path from service: ' + url);
};

module.exports.Summarizer = Summarizer;