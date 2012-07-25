"use strict";
var express = require('express'),
    less = require('less'),
    fs = require('fs');

var app = module.exports = express.createServer();

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
    less.render(contents, { paths: [ app.staticFolder + '/stylesheets' ] }, callback);
  });
});

app.get(/^\/stylesheets\/(?:\w+)$/, function (req, res) {
  res.contentType('text/css');
  res.render(app.staticFolder + req.url + '.less');
});

app.get(/^\/(?:\w+\/)*(?:(?:\w+\.)+\w+)?$/, function (req, res) {
  res.sendfile(app.staticFolder + req.url);
});
