define(['lib/jquery', 'lib/jquery.ui.autocomplete'],
function ($) {
  "use strict";
  
  function autocompleteTopic(selector) {
    $(selector).autocomplete({
      delay: 50,
      autoFocus: true,
      source: function (request, response) {
        $.ajax({
          url: "http://en.wikipedia.org/w/api.php",
          dataType: "jsonp",
          data: {
            action: "opensearch",
            format: "json",
            search: request.term
          },
          success: function (data) {
            response(data[1]);
          }
        });
      }
    });
  }
  
  return autocompleteTopic;
});
