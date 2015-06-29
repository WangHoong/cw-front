"use strict";

var views = require('co-views');
var koa = require('koa');
var path = require('path');
var config = require('config');

var app = koa();

var render = views(__dirname + '/public/views', {
    map: {html: 'swig'}
});

app.use(require('koa-static')(path.join(__dirname, '/public'), {}));

app.use(function *() {
    this.body = yield render('index', {API_PREFIX: config['API_PREFIX']});
});

app.listen(9009);