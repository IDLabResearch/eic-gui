define(['lib/jquery', 'lib/jvent'], function ($, EventEmitter) {
	"use strict";

  var FB;

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
    }
  };

  return FacebookConnector;
});
