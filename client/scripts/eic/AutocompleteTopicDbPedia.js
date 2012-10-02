define(['lib/jquery', 'lib/jquery.ui.autocomplete'],
function ($) {
  "use strict";
  
  function autocompleteTopicDbPedia(selector) {
    $(selector).catcomplete({
      delay: 50,
      autoFocus: true,
      source: function (request, response) {
				$.ajax({
					//TODO: Change to pathfinding.restdesc.org
          url: "http://localhost:1112/findPrefix",
          dataType: "jsonp",
          data: {
            q: request.term
          },
          success: function (data) {
            response(data);
          }
        });
        
      },
      select: function (event, ui) {
        // Also update if a value is selected (instead of typed).
        $(this).val(ui.item.value)
               .trigger('change');
      }
    });
  }
  
  return autocompleteTopicDbPedia;
});
