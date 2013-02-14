/*!
 * EIC AutocompleteTopic
 * Copyright 2012, Multimedia Lab - Ghent University - iMinds
 * Licensed under GPL Version 3 license <http://www.gnu.org/licenses/gpl.html> .
 */
define(['lib/jquery', 'lib/jquery.ui.autocomplete', 'config/URLs'],
  function ($, autocomplete, urls) {
    "use strict";
  
    /*
   * Extend to facebook & DBPedia
   **/

    function autocompleteTopic($elem) {
      $elem.catcomplete({
        delay: 50,
        autoFocus: true,
        source: function (request, response) {
          $.ajax({
            url: urls.autocompletion,
            dataType: "json",
            data: {
              query: request.term
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
          if (ui.item)
            $(this).data('uri', ui.item.label.toUpperCase() === $(this).val().toUpperCase() ? ui.item && ui.item.uri : '');
        },
        change: function (event, ui) {
          if (ui.item)
            $(this).data('uri', ui.item.label.toUpperCase() === $(this).val().toUpperCase() ? ui.item && ui.item.uri : '');
        }
      });
    }

    return autocompleteTopic;
  });
