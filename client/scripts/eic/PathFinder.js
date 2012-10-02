define(['lib/jquery', 'lib/jvent'],
function ($, EventEmitter) {
  "use strict";
  
  function PathFinder() {
		EventEmitter.call(this);
  }

	PathFinder.prototype = {
    findSubject : function (object_value, type, callback) {
			$.ajax({
          url: "http://pathfinding.restdesc.org/findSubject?",
          dataType: "jsonp",
          data: {
            object_value: object_value,
            type: type
          },
          success: function (data) {
            callback(data);
          }
        });
    }
	};

  return PathFinder;
});
