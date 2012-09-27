"use strict";
var http = require('http'),
sparql = require('sparql');

var summ = module.exports;

summ.summarize = function (req, res) {
  var from = req.param('from'), 
  to = req.param('to');
  
  summ.retrievePath(from, to);
  
  console.log('Summarization has started!');
}

summ.retrievePath = function (from, to) {
  var url = "http://pathfinding.restdesc.org/findPath?s1=" + from + "&s2=" + to;
  http.get(url, function(response) {
    var str = '';

    //another chunk of data has been recieved, so append it to `str`
    response.on('data', function (chunk) {
      str += chunk;
    });

    //the whole response has been recieved, so we just print it out here
    response.on('end', function () {
      //var data = JSON.parse(str);
      //TestData
      var data = {
        "execution_time":9100,
        "paths":{
          "vertices": [
            'http:\/\/dbpedia.org\/resource\/David_Guetta',
            'http:\/\/dbpedia.org\/resource\/Chris_Willis', 
            'http:\/\/dbpedia.org\/resource\/United_States', 
            'http:\/\/dbpedia.org\/resource\/Chicago_Theatre'
          ],
          "edges":[
            'http:\/\/dbpedia.org\/ontology\/associatedMusicalArtist',
            'http:\/\/dbpedia.org\/property\/birthPlace',
            'http:\/\/dbpedia.org\/property\/place']
        }
      }
      
      data.paths.vertices.forEach(summ.retrieveAbstract);
      data.paths.edges.forEach(summ.retrieveTranscription);
      
    });
  }).on('error', function (e) {
    console.log("Got error: " + e.message);
  });
  console.log('Retrieving path from service: ' + url);
}

summ.retrieveAbstract = function (vertice) {
 
  var client = new sparql.Client('http://dbpedia.org/sparql');
  
  client.query('select * where { ?s ?p ?o } limit 100', function(err){
    
  }, function(res){
    
  });
  console.log(vertice);
}

summ.retrieveTranscription = function (edge) {
  var  property = edge.substr(edge.lastIndexOf('/'));
  console.log(property);
}

