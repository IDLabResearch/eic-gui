define(['lib/jquery', 'lib/jvent'], function ($, EventEmitter) {
	"use strict";

  var FB;

  function findPlacesNearUser(id, callback) {
    var place_id = '';

    var latitude = '';
    var longitude = '';

    FB.api('/me', function (response) {
      var query = FB.Data.query('select name, hometown_location from user where uid=' + id, response.id);
      query.wait(function (rows) {
        place_id = rows[0].hometown_location.id;
        FB.api('/me', function (response) {
          var query = FB.Data.query('select latitude, longitude from place where page_id=' + place_id, response.id);
          query.wait(function (rows) {
            latitude = rows[0].latitude;
            longitude = rows[0].longitude;
            FB.api('/search?center=' + latitude + ',' + longitude + '&type=place', function (response) {
              callback(response);
            });
          });
        });
      });
    });
  }

  function FacebookConnector() {
    EventEmitter.call(this);
  }


  FacebookConnector.prototype = {
    init : function (login_action, logout_action) {
      window.fbAsyncInit = function () {
        FB = window.FB;

        FB.init({
          appId : '412169445496429',
          status : true,
          cookie : true,
          xfbml : true
        });

        /* All the events registered */
        FB.Event.subscribe('auth.login', function (response) {
          // do something with response
          login();
        });
        FB.Event.subscribe('auth.logout', function (response) {
          // do something with response
          logout();
        });

        FB.getLoginStatus(function (response) {
          if (response.session) {
            // logged in and connected user, someone you know
            login();
          }
        });
      };

      var e = document.createElement('script');
      e.type = 'text/javascript';
      e.src = document.location.protocol + '//connect.facebook.net/en_US/all.js';
      e.async = true;
      document.getElementById('fb-root').appendChild(e);

      function login() {
        (typeof login_action == 'undefined') ? console.log('login') : login_action();
      }

      function logout() {
        (typeof logout_action == 'undefined') ? console.log('logout') : logout_action();

      }


      console.log("hello facebook");
    },

    connect : function (callback) {
      FB.login(function (response) {
        if (response.authResponse) {
          console.log('Welcome!  Fetching your information.... ');
          FB.api('/me', function (response) {
            console.log('Good to see you, ' + response.name + '.');
            callback(0, response);
          });

        } else {
          callback(1, null);
          console.log('User cancelled login or did not fully authorize.');
        }
      }, {
        scope : 'email,user_hometown,user_interests,user_likes,user_photos,user_birthday'
      });
    },

    disconnect : function (callback) {
      FB.logout(function (response) {
        console.log("disconnecting");
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
    
    findPlacesNearUser : function (facebook_id, callback) {
      findPlacesNearUser(facebook_id, callback);
    },
    
    findPlacesNearMe : function (callback) {
			findPlacesNearUser('{0}', callback);
		}

  };

  return FacebookConnector;
});