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
      var data = JSON.parse(str);
      console.log(data.paths);

      
      /*data.paths.forEach(function(path){
        console.log(path);
        
        
      });*/
    });
  }).on('error', function (e) {
    console.log("Got error: " + e.message);
  });
  console.log('Retrieving path from service: ' + url);
}

summ.retrieveAbstract = function (node) {
  var client = new sparql.Client('http://dbpedia.org/sparql');
  
  client.query('select * where { ?s ?p ?o } limit 100', function(err){
    
    }, function(res){
    
    });
}

summ.retrieveTranscription = function () {
  
  }

