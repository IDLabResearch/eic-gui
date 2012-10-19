define(['lib/jquery', 'lib/jvent'], function ($, EventEmitter) {
	"use strict";

  var FB;
  var connectorScriptLoaded = false;

  function FacebookConnector() {
    EventEmitter.call(this);
  }

  FacebookConnector.prototype = {
    init : function (login_action, logout_action) {
      login_action = login_action || $.noop;
      logout_action = logout_action || $.noop;
      
      window.fbAsyncInit = function () {
        FB = window.FB;

        FB.init({
          appId : '412169445496429',
          status : true,
          cookie : true,
          xfbml : true
        });

        /* All the events registered */
        FB.Event.subscribe('auth.login', login_action);
        FB.Event.subscribe('auth.logout', logout_action);

        FB.getLoginStatus(function (response) {
          if (response.session)
            login_action();
        });
      };
      if (!connectorScriptLoaded) {
        $.getScript('http://connect.facebook.net/en_US/all.js');
        connectorScriptLoaded = true;
      }
    },

    connect : function (callback) {
      FB.login(function (response) {
        if (response.authResponse) {
          FB.api('/me', function (profile) {
            // Make profile behave like a Topic
            profile.uri = profile.link;
            profile.label = profile.name;
            profile.type = "facebook";
            
            callback(0, profile);
          });
        }
        else {
          callback('User cancelled login or did not fully authorize.');
        }
      },
      {
        scope: 'email,user_hometown,user_interests,user_likes,user_photos,user_birthday,user_about_me'
      });
    },

    disconnect : function (callback) {
      FB.logout(function (response) {
        callback(0, response);
      });
    },

    get : function (item_type, callback) {
      FB.api('/me/' + item_type, function (response) {
        callback(response);
      });
    },

    findEvent : function (query, callback) {
      FB.api('/search?q=' + query + '&type=event', function (response) {
        callback(response);
      });
    },
    
    findPlace : function (query, callback) {
      FB.api('/search?q=' + query + '&type=place', function (response) {
        callback(response);
      });
    },

    findBusinessByGeoLocation : function (query, latitude, longitude, distance, callback) {
      FB.api('/search?q=' + query + 'center=' + latitude + ',' + longitude + '&distance=' + distance + '&type=place', function (response) {
        callback(response);
      });
    },

    findPlaceById : function (place_fb_id, callback) {
      //Interesting parameters: description and number of times users checked in a location
      FB.api('/me', function (response) {
        var query = FB.Data.query('select name, latitude, longitude, description, geometry, checkin_count, display_subtext from place where page_id=' + place_fb_id, response.id);
        query.wait(function (rows) {
          callback(rows[0]);
        });
      });
    },
    
    getPlace: function (place_fb_id, callback) {
			FB.api('/' + place_fb_id, function (response) {
        callback(response);
      });
    },
    
    findPlacesNearMe : function (facebook_id, callback) {
      FB.api('/me', function (response) {
        var query = FB.Data.query('select name, hometown_location from user where uid={0}', response.id);
        query.wait(function (rows) {
          var place_id = rows[0].hometown_location.id;
          FB.api('/me', function (response) {
            var query = FB.Data.query('select latitude, longitude from place where page_id={0}', place_id);
            query.wait(function (rows) {
              var latitude = rows[0].latitude,
                  longitude = rows[0].longitude;
              FB.api('/search?center=' + latitude + ',' + longitude + '&type=place', function (response) {
                callback(response);
              });
            });
          });
        });
      });
    },
  };

  return FacebookConnector;
});
