define(['lib/jquery', 'lib/jquery.ui.autocomplete'],
function ($) {
  "use strict";
  
  function autocompleteTopic(selector) {
    $(selector).autocomplete({
      source: function (request, response) {
        $.ajax({
          url: "http://ws.geonames.org/searchJSON",
          dataType: "jsonp",
          data: {
            featureClass: "P",
            style: "full",
            maxRows: 12,
            name_startsWith: request.term
          },
          success: function (data) {
            response($.map(data.geonames, function (item) {
              return {
                label: item.name,
                value: item.name
              };
            }));
          }
        });
      }
    });
  }
  
  return autocompleteTopic;
});
