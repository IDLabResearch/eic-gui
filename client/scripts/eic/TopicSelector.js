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
          var responses = response.data;
          var count = 0;
          var topics = [];
          var uris = [];
          var supports = [];
          var maxTopic;
          var maxUri;
          var maxSupport = 0;
          $.each(responses, function (index, r) {
            var topic = r.name;
            self.getURI(topic, function (uri, wikiPageWikiLinks, error) {
              if (error === undefined) {
                topics.push(topic);
                uris.push(uri);
                supports.push(parseInt(wikiPageWikiLinks, 10));
              }
              count++;
              if (count == responses.length) {
                var index;
                for (index = 0; index < supports.length; index++) {
                  if (supports[index] > maxSupport) {
                    maxSupport = supports[index];
                    maxTopic = topics[index];
                    maxUri = uris[index];
                  }
                }
                callback(maxTopic, maxUri);
              }
            });
          });
        });
    },

    getURI : function (topic, callback) {
      new PathFinder().findSubject('"' + topic + '"', 'artist', function (response) {
							callback(response.uri, response.wikiPageWikiLinks, response.error);
						});
    },
  };

  return TopicSelector;
});
