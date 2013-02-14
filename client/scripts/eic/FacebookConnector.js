/*!
 * EIC FacebookConnector
 * Copyright 2012, Multimedia Lab - Ghent University - iMinds
 * Licensed under GPL Version 3 license <http://www.gnu.org/licenses/gpl.html> .
 */
define(['lib/jquery', 'lib/jvent'], function ($, EventEmitter) {
  "use strict";

  /***** Configuration *****/

  var defaultProperties = [ 'email', 'user_hometown', 'user_interests',
  'user_likes', 'user_photos', 'user_birthday',
  'user_about_me' ];


  /***** Facebook loader *****/

  /* Internal reference to window.FB, will be initialized in fbAsyncInit. */
  var FB;

  /* Call the specified function when Facebook is ready. */
  function onFacebookReady(callback) {
    if (FB) return callback();
    onFacebookReady.callbacks.push(callback);
  }
  onFacebookReady.callbacks = [];

  /* Initialization function that will be called by the Facebook API. */
  window.fbAsyncInit = function () {
    // Initialize the Facebook API for our application
    FB = window.FB;
    FB.init({
      appId: window.fbAppId || '412169445496429',
      status: true,
      cookie: true,
      xfbml: true
    });

    // Execute pending callbacks
    onFacebookReady.callbacks.forEach(function (callback) {
      callback();
    });
    delete onFacebookReady.callbacks;
  };
  // Load the Facebook API script
  $.getScript('http://connect.facebook.net/en_US/all.js');


  /***** FacebookConnector class *****/

  /* Simplified interface to the Facebook API. */
  function FacebookConnector() {
    EventEmitter.call(this);
    this.status = "disconnected";
  }

  FacebookConnector.prototype = {
    /* Initialize the Facebook connector. */
    init: function () {
      // Automatically connect to Facebook if possible
      FB.getLoginStatus($.proxy(this.connectionCallback, this));
    },

    /* Connect to Facebook. */
    connect: function (callback) {
      this.once("disconnected", callback);
      FB.login($.proxy(this.connectionCallback, this),
      {
        scope: defaultProperties.join()
      });
    },

    /* Handle a Facebook connection callback. */
    connectionCallback: function (response) {
      // Only act on status changes
      if (response.status === this.status)
        return;
      this.status = response.status;

      // In case of connection, raise "connected" event with profile argument
      if (response.status === "connected") {
        var self = this;
        this.getProfile(function (profile) {
          profile.connector = self;
          self.emit("connected", profile);
        });
      }
    },

    /* Disconnect from Facebook. */
    disconnect: function (callback) {
      var self = this;
      this.once("disconnected", callback);
      FB.logout(function (response) {
        self.status = "disconnected";
        self.emit("disconnected");
      });
    },

    /* Get data from the user. */
    get: function (itemType, callback) {
      FB.api('/me/' + itemType, callback);
    },

    /* Get the user's profile data. */
    getProfile: function (callback) {
      FB.api('/me', function (profile) {
        // Make profile behave like a Topic
        profile.uri = profile.link;
        profile.label = profile.name;
        profile.type = "facebook";

        callback(profile);
      });
    },
  };

  // Wrap all FacebookConnector member functions in a proxy,
  // so they only execute when the Facebook API is ready.
  Object.keys(FacebookConnector.prototype).forEach(function (name) {
    var origMember = FacebookConnector.prototype[name];
    if (typeof origMember === 'function') {
      // Replace the member function by a delayed version of itself
      FacebookConnector.prototype[name] = function () {
        var args = arguments, self = this;
        onFacebookReady(function () {
          origMember.apply(self, args);
        });
      };
    }
  });

  return FacebookConnector;
});
