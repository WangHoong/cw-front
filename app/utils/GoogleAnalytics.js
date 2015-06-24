'use strict';

(function(window, document, script, url, r, tag, firstScriptTag) {
  window.GoogleAnalyticsObject = r;
  window[r] = window[r] || function() {
    (window[r].q = window[r].q || []).push(arguments);
  };
  window[r].l = 1 * new Date();
  tag = document.createElement(script);
  firstScriptTag = document.getElementsByTagName(script)[0];
  tag.async = 1;
  tag.src = url;
  firstScriptTag.parentNode.insertBefore(tag, firstScriptTag);
})(
  window,
  document,
  'script',
  '//www.google-analytics.com/analytics.js',
  'ga'
);

window.ga('create', 'UA-62351934-1', 'auto');

module.exports = exports = function analytics(state){
  window.ga('send', 'pageview', {
    'page': state.path
  });
};
