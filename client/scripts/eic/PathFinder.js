define(['lib/jquery', 'lib/jvent'],
function ($, EventEmitter) {
  "use strict";
  
  /*
   * CLEANUP
   * renamed
   **/
  
  function PathFinder() {
		EventEmitter.call(this);
  }

	PathFinder.prototype = {
    findSubject : function (object_value, type, callback) {
			$.ajax({
          url: "http://pathfinding.restdesc.org/findSubject",
          //url: "http://157.193.213.21:11112/findSubject",
          dataType: "json",
          data: {
            object_value: object_value,
            type: type
          },
          success: function (data) {
            callback(data);
          },
          error: function (jqXHR, textStatus, errorThrown) {
            callback({error: textStatus});
          }
        });
    }
	};

  return PathFinder;
});
