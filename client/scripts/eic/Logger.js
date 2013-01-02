define(function () {
  "use strict";

  var start = new Date();

  function Logger(module) {
    this.module = module || "Application";
  }

  Logger.prototype = {
    log: function (varargs) {
      var elapsed = new Date() - start;
      var text =  (elapsed / 1000) + "s:\t[" + this.module + "]\t";
      var logItems = Array.prototype.concat.apply([text], arguments);
      console.log.apply(console, logItems);
    },
  };

  return Logger;
});
