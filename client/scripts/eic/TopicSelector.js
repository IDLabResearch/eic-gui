/*!
 * EIC TopicSelector
 * Copyright 2012, Multimedia Lab - Ghent University - iMinds
 * Licensed under GPL Version 3 license <http://www.gnu.org/licenses/gpl.html> .
 */
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
    selectTopic: function () {
      var self = this;
      var demand = $.Deferred();
      self.facebookConnector.get('likes', function (response) {
        var likes = response.data;
        if (!likes.length)
          return demand.reject("You have no likes, so no topic can be found.");

        // Convert likes to URIs
        $.ajax({
          url: urls.topics,
          dataType: "json",
          data: {
            label: likes.map(function (l) { return l.name; }).join()
          },
          error: function (jqXHR, textStatus, errorThrown) {
            demand.reject("Error finding topic from likes: " + errorThrown);
          },
          success: function (topics) {
            if (!topics.length)
              return demand.reject("None of your likes could be mapped to a topic.");

            // Try to use only strongly connected topics
            topics = topics.sort(function (a, b) { return b.connectivity - a.connectivity; });
            if (hasLargeConnectivity(topics[0])) {
              // Pick one of the most connected topics
              topics = topics.filter(hasLargeConnectivity);
              var randomTopic = topics[Math.floor(Math.random() *
                                                  Math.min(topics.length, topCandidates))];
              demand.resolve(randomTopic);
            }
            // If no strongly connected topic exists, use the most-connected topic.
            else {
              demand.resolve(topics[0]);
            }
          },
        });
      });
      return demand.promise();
    },
  };

  return TopicSelector;
});
