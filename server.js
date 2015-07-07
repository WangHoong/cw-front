var koa = require('koa');
var views = require('co-views');
var _static = require('koa-static');
var route = require('koa-route');
var path = require('path');
var config = require('config');
var logger = require('koa-logger');

var app = koa();

var render = views(__dirname + '/views', {
  map: {html: 'swig'}
});
app.use(logger());
app.use(_static(path.join(__dirname, '/build'), {}));

app.use(route.get('/', function *() {
  this.body = yield render('index', {API_PREFIX: config['API_PREFIX']});
}));

app.listen(9000);
console.log('listening on port 9000');
