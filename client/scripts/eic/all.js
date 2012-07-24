(function (define) {
  "use strict";
  var all = [
    './BaseSlideGenerator',
    './IntroductionSlideGenerator',
    './CombinedSlideGenerator',
    './GoogleImageSlideGenerator',
    './SlidePresenter',
    './TitleSlideGenerator',
    './VideoSlideGenerator',
  ];
  define(all, function () {
    var eic = {};
    for (var i = 0; i < all.length; i++)
      eic[all[i].substr(2)] = arguments[i];
    return eic;
  });
})(define);
