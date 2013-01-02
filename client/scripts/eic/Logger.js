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
      console.log.apply(console, logItems);
    },
  };

  function pad(text, length) {
    while (text.length < length)
      text = ' ' + text;
    return text;
  }

  return Logger;
});
