"use strict";
var express = require('express'),
less = require('less'),
fs = require('fs'),
summ = require('./summarizer.js');

var app = module.exports = express();
app.use(express.bodyParser());
app.use(express.methodOverride());
app.use(app.router);

app.start = function (port, staticFolder) {
  port = port || 4000;
  this.staticFolder = staticFolder;

  this.listen(port);
  console.log('Everything Is Connected server running at http://localhost:' + port + '/');
};

app.engine('.less', function (path, options, callback) {
  fs.readFile(path, 'utf8', function (error, contents) {
    if (error)
      return callback(error);
    less.render(contents, {
      paths: [ app.staticFolder + '/stylesheets' ]
    }, callback);
  });
});

app.get(/^\/stylesheets\/(?:\w+)$/, function (req, res) {
  res.contentType('text/css');
  res.render(app.staticFolder + req.url + '.less');
});

app.get(/^\/(?:[\-\w]+\/)*(?:(?:[\-\w]+\.)+[\-\w]+)?$/, function (req, res) {
  res.sendfile(app.staticFolder + req.url);
});

app.post('/stories', function (req, res) {
  //res.redirect(303, '/stories/1');
  var summarizer = new summ.Summarizer();

  summarizer.on('generated',function(result){
    for (var i = 1; i < result.topics.length; i++){
      result.topics[i].text = result.topics[i - 1].label + result.links[i - 1] + result.topics[i].label + '.' + result.topics[i].text;
    }

    res.json({steps: result.topics});
  });
  summarizer.summarize(req, res);
});

app.get('/stories', function (req, res) {
  //res.redirect(303, '/stories/1');
  var summarizer = new summ.Summarizer();

  summarizer.on('generated',function(result){
    for (var i = 1; i < result.topics.length; i++){
      result.topics[i].text = result.topics[i - 1].topic.label + result.links[i - 1] + result.topics[i].topic.label + '. ' + result.topics[i].text;
    }

    res.json({steps: result.topics});
  });
  summarizer.summarize(req, res);
});

app.get(/^\/stories\/\d+$/, function (req, res) {
  res.sendfile(__dirname + req.url + '.json');
});


