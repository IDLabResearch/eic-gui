"use strict";
var express = require('express'),
    less = require('less'),
    fs = require('fs'),
    ejs = require('ejs');

var app = module.exports = express();
app.use(express.bodyParser());
app.use(express.methodOverride());
app.use(app.router);

app.start = function (port, options) {
  port = port || 4000;
  this.staticFolder = options.staticFolder;
  this.environment = options.environment || 'development';

  this.listen(port);
  console.log('Everything Is Connected server running at http://localhost:' + port + '/');
};

app.engine('.html.ejs', ejs.__express);

app.engine('.less', function (path, options, callback) {
  fs.readFile(path, 'utf8', function (error, contents) {
    if (error)
      return callback(error);
    less.render(contents, {
      paths: [ app.staticFolder + '/stylesheets' ]
    }, callback);
  });
});

app.get('/', function (req, res) {
  res.render(app.staticFolder + '/index.html.ejs', { environment: app.environment });
});

app.get(/^\/stylesheets\/(?:\w+)$/, function (req, res) {
  res.contentType('text/css');
  res.render(app.staticFolder + req.url + '.less');
});

app.get(/^\/(?:[\-\w]+\/)*(?:(?:[\-\w]+\.)+[\-\w]+)?$/, function (req, res) {
  res.sendfile(app.staticFolder + req.url);
});