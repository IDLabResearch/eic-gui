define(['lib/jquery', 'config/URLs'],
function ($, urls) {
	"use strict";

  // Topic selector with a user's Facebook profile as input
  function TopicSelector(facebookConnector) {
    this.facebookConnector = facebookConnector;
  }

  TopicSelector.prototype = {
    // Select a topic, based on the user's Facebook profile
    selectTopic: function (callback) {
      this.facebookConnector.get('music', function (response) {
        // Check user likes
        var likes = response.data;
        if (!likes.length)
          throw "This user has no likes, so no topic can be found.";

        // Convert likes to URIs
        $.ajax({
          url: urls.topics,
          dataType: "json",
          data: {
            label: likes.map(function (l) { return l.name; }).join()
          },
          error: function (jqXHR, textStatus) {
            throw "Error finding topic from likes: " + textStatus;
          },
          success: function (topics) {
            if (!topics.length)
              throw "None of the user's likes could be mapped to a topic.";

            // Return the topic with the highest connectivity
            callback(topics.reduce(function (prev, cur) {
              return cur.connectivity > prev.connectivity ? cur : prev;
            }));
          },
        });
      });
    },
  };

  return TopicSelector;
});
