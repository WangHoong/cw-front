// render.js - houjiazong, 2015/08/11
var views = require('co-views');

module.exports = views(__dirname + '/../views', {
  map: {
    html: 'swig'
  }
});
