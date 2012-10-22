define(['lib/jquery', 'lib/jquery.ui.autocomplete'],
function ($) {
  "use strict";
  
  /*
   * Extend to facebook & DBPedia
   **/

  function autocompleteTopic(selector) {
    $(selector).catcomplete({
      delay: 50,
      autoFocus: true,
      source: function (request, response) {
				$.ajax({
          url: "http://pathfinding.restdesc.org/findPrefix",
          dataType: "json",
          data: {
            q: request.term
          },
          success: function (data) {
            response(data);
          }
        });
      },
      select: function (event, ui) {
        $(this).val(ui.item.label);
        $(this).data('uri', ui.item && ui.item.uri);
        $(this).trigger('change');
      },
      focus: function (event, ui) {
        $(this).data('uri', ui.item && ui.item.uri);
      },
      change: function (event, ui) {
        $(this).data('uri', ui.item && ui.item.uri);
      }
    });
  }

  return autocompleteTopic;
});
