var koa = require('koa');
var views = require('co-views');
var _static = require('koa-static');
var route = require('koa-route');
var path = require('path');
var config = require('config');
var logger = require('koa-logger');
var _ = require('lodash');
var request = require('co-request');

var app = koa();

var render = views(__dirname + '/views', {
  map: {
    html: 'swig'
  }
});

app.use(logger());

app.use(_static(path.join(__dirname, '/build'), {}));

if (app.env != 'production') {
  app.use(function*(next) {
    if (_.startsWith(this.path, '/api')|| _.startsWith(this.path, '/test')) {
      var result = yield request({
        uri: config['PROXY_PREFIX'] + this.path,
        method: this.method,
        headers: {
          cookie: this.request.headers.cookie
        },
        debug: true
      });
      this.status = 200;
      this.body = result.body;
      return;
    }
    yield next;
  });
}

app.use(route.get('/login_demo', function *() {
  this.body = yield render('login_demo', {
    API_PREFIX: config['API_PREFIX']
  });
}));

app.use(route.get('/', function*() {
  this.body = yield render('index', {
    API_PREFIX: config['API_PREFIX']
  });
}));

app.listen(process.env.PORT || 9000, function() {
  console.log('listening on port 9000');
});
