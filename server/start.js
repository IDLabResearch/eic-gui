#!/usr/bin/env node
var server = require('./eic-server.js');
server.start(4000, __dirname.replace(/\w+$/, 'client'));
