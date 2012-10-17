define(['lib/jquery', 'lib/jvent', 'eic/FacebookConnector', 'eic/PathFinder'], function ($, EventEmitter, FacebookConnector, PathFinder) {
	"use strict";
  function TopicSelector() {
    EventEmitter.call(this);
  }
  TopicSelector.prototype = {
    init : function () {
    },
    
    selectTopicFromProfile : function (profile, callback) {
      var self = this;
      new FacebookConnector().get('music', function (response) {
          var topic = response.data[0].name;
          self.getURI(topic, function (uri, error) {
            if (error === undefined) {
              callback(topic, uri);
            } else {
              //topic has no DBPedia uri
            }
          });
        });
    },
    
    getURI : function (topic, callback) {
      new PathFinder().findSubject('"' + topic + '"', 'artist', function (response) {
							callback(response.uri, response.error);
						});
    }
  };
  
  return TopicSelector;
});