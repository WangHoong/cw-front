var koa = require('koa');
var _static = require('koa-static');
var path = require('path');
var config = require('config');
var logger = require('koa-logger');
var proxy = require('koa-proxy');

var router = require('./lib/route');

var app = koa();

var defaultLocale = 'en-us';

app.use(_static(path.join(__dirname, '/build'), {}));

app.use(function *(next) {
  var languages = this.acceptsLanguages();
  if (languages) {
    if (Array.isArray(languages)) {
      if (languages.length > 0) {
        languages = languages[0];
      } else {
        languages = defaultLocale;
      }
    } else {
      languages = defaultLocale;
    }
  } else {
    languages = defaultLocale;
  }
  this.__language = languages.toLowerCase();
  yield next;
});

if (app.env != 'production') {
  app.use(logger());
  app.use(proxy({
    host: config['PROXY_PREFIX'],
    match: /(^\/test\/|^\/api\/|^\/online|^\/sms)/
  }));
  app.use(router.dev().routes());
}

app.use(router.pro().routes());

app.listen(process.env.PORT || 9000, function() {
  console.log('listening on port 9000');
  process.send && process.send('online');
});
