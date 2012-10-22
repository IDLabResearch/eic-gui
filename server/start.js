#!/usr/bin/env node
var server = require('./eic-server.js');
server.start(process.argv[2], __dirname.replace(/\w+$/, 'client'));
