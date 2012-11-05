define(['lib/jquery', 'config/URLs'],
function ($, urls) {
	"use strict";

  // The topic is selected from the top `topCandidates` most connected topics
  var topCandidates = 10;
  // Preferred minimum connectivity for a node to be selected.
  var minConnectivity = 10;
  function hasLargeConnectivity(t) { return t.connectivity > minConnectivity; }

  // Topic selector with a user's Facebook profile as input
  function TopicSelector(facebookConnector) {
    this.facebookConnector = facebookConnector;
  }

  TopicSelector.prototype = {
    // Select a topic, based on the user's Facebook profile
    selectTopic: function (callback) {
      var self = this;
      self.facebookConnector.get('likes', function (response) {
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

            // Use only strongly connected topics (if they exist)
            if (topics.some(hasLargeConnectivity))
              topics = topics.filter(hasLargeConnectivity);

            // Pick one of the most connected topics
            topics = topics.sort(function (a, b) { return b.connectivity - a.connectivity; });
            var topic = topics[Math.floor(Math.random() *
                                          Math.min(topics.length, topCandidates))];
            callback(topic);
          },
        });
      });
    },
  };

  return TopicSelector;
});
