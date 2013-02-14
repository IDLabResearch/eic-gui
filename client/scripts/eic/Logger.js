/*!
 * EIC Logger
 * Copyright 2012, Multimedia Lab - Ghent University - iMinds
 * Licensed under GPL Version 3 license <http://www.gnu.org/licenses/gpl.html> .
 */
define(function () {
  "use strict";

  var start = new Date();
  var longestModuleLength = 0;

  function Logger(module) {
    this.module = module || "Application";
    if (this.module.length > longestModuleLength)
      longestModuleLength = this.module.length;
  }

  Logger.prototype = {
    log: function (varargs) {
      var elapsed = new Date() - start;
      var text = pad(elapsed + '', 6).replace(/(\d{3})$/, ".$1s:\t") +
                 "[" + pad(this.module, longestModuleLength) + "]";
      var logItems = Array.prototype.concat.apply([text], arguments);
      try {
      	console.log.apply(console, logItems);
      }
      catch(e) {
      	console.log(logItems);
      }
    },
  };

  function pad(text, length) {
    while (text.length < length)
      text = ' ' + text;
    return text;
  }

  return Logger;
});
