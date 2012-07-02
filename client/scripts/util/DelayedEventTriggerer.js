define(['lib/jquery'], function ($) {
  "use strict";
  
  /** Returns an event handler that triggers a new event
      after the specified delay. */
  return function (eventName, delay) {
    return function (event) {
      window.setTimeout(function () {
        $(event.target).trigger(eventName);
      }, delay);
    };
  }
});
