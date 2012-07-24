define(['lib/jquery', 'lib/jvent'], function($, EventEmitter) {"use strict";

	function FacebookConnector() {
		EventEmitter.call(this);
	}

	FacebookConnector.prototype = {
		init : function() {
			window.fbAsyncInit = function() {
				FB.init({
					appId : '412169445496429',
					status : true,
					cookie : true,
					xfbml : true
				});

				/* All the events registered */
				FB.Event.subscribe('auth.login', function(response) {
					// do something with response
					login();
				});
				FB.Event.subscribe('auth.logout', function(response) {
					// do something with response
					logout();
				});

				FB.getLoginStatus(function(response) {
					if (response.session) {
						// logged in and connected user, someone you know
						login();
					}
				});
			}; ( function() {
					var e = document.createElement('script');
					e.type = 'text/javascript';
					e.src = document.location.protocol + '//connect.facebook.net/en_US/all.js';
					e.async = true;
					document.getElementById('fb-root').appendChild(e);
				}());

			function login() {
				FB.api('/me', function(response) {
					var query = FB.Data.query('select name, hometown_location, birthday, sex, pic_square from user where uid={0}', response.id);
					query.wait(function(rows) {
						document.getElementById('info').innerHTML = 'Your name: ' + rows[0].name + "<br />" + '<img src="' + rows[0].pic_square + '" alt="" />' + "<br />" + rows[0].birthday + "<br />" + rows[0].hometown_location.city + "," + rows[0].hometown_location.country;
					});
				});
				$('#connect').hide();
				$('.step.two').removeClass("inactive");
			}

			function logout() {
				$('#info').empty();
				$('#connect').show();
				$('.step.two').addClass("inactive");
			}

			console.log("hello facebook");
		},

		get : function(item_type, callback) {
			FB.api('/me/' + item_type, function(response) {
				callback(response);
			});
		}
	};

	return FacebookConnector;
});
