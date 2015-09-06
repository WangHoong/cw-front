// HTTPLog.js - houjiazong, 2015/08/28
var axios = require('axios');
window.__httpLog = (function(undefined) {
  var MAX_LENGTH = 100,
      LOCAL_DB_KEY = 'dmc_rlog';
  var logArr = localStorage.getItem(LOCAL_DB_KEY) === null ? [] : JSON.parse(localStorage.getItem(LOCAL_DB_KEY));
  var saveToLocalDB = function(obj) {
    if (logArr.length >= MAX_LENGTH) {
      logArr.shift();
    }
    logArr.push(obj);
    localStorage.setItem(LOCAL_DB_KEY, JSON.stringify(logArr));
  };
  axios.interceptors.request.use(function(config) {
    config.__startTime = +new Date();
    return config;
  }, function(error) {
    return Promise.reject(error);
  });
  axios.interceptors.response.use(function(response) {
    var name = response.config.url,
      time = +new Date() - response.config.__startTime;
    saveToLocalDB({
      name: name,
      time: time + 'ms'
    });
    // console.log('%ctime: ' + time + 'ms ------ name: ' + name, 'font-size: 14px; color: #fff; background-color: green; padding: 1px 5px;');
    return response;
  }, function(error) {
    return Promise.reject(error);
  });
  return {
    getLog: function() {
      var results = localStorage.getItem(LOCAL_DB_KEY);
      return JSON.parse(results);
    }
  };
})();
