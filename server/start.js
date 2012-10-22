#!/usr/bin/env node
var server = require('./eic-server.js');
server.start(process.argv[2], { staticFolder: __dirname.replace(/\w+$/, 'client'),
                                environment: process.argv[3] });
