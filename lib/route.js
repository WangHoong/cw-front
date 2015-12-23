// routes.js - houjiazong, 2015/08/11
var router = require('koa-router')();
var config = require('config');
var render = require('./render');
var version = require('../package.json').version;
var request = require('co-request');

module.exports = {
  dev: function() {
    router.get('/login_demo', function*() {
      this.body = yield render('login_demo', {
        API_PREFIX: config['API_PREFIX'],
        PROXY_PREFIX: config['PROXY_PREFIX']
      });
    });
    return router;
  },
  pro: function() {
    // cms index
    router.get('/', function *() {
      var online_url = config['PROXY_PREFIX'] ? config['PROXY_PREFIX'] + '/api/v1/online' : '/api/v1/online';
      var response = yield request({
        uri: online_url,
        method: 'GET',
        headers: {
          cookie: this.headers.cookie
        }
      });
      var body = response.body;

      if (typeof body === 'string') {
        body = JSON.parse(body);
      }

      if (!body.data.online) {
        return this.redirect('/home');
      }

      this.body = yield render('index', {
        API_PREFIX: config['API_PREFIX'],
        LOGIN_URL: config['LOGIN_URL'],
        UPLOAD_FILE_URL: config['UPLOAD_FILE_URL'],
        version: version,
        lang: JSON.stringify(require(__dirname +'/../i18n/' + this.__language).app),
      });
    });
    // login
    router.get('/login', function *() {
      var url = config['LOGIN_URL'] + '?' + this.querystring;
      this.redirect(url);
    });
    // 装逼首页
    router.get('/index', function *() {
      this.body = yield render('dmc_index');
    });
    // 装逼首页
    router.get('/home', function *() {
      this.body = yield render('topdmc', {
        LOGIN_URL: config['LOGIN_URL'],
        lang: require(__dirname +'/../i18n/' + this.__language).home,
      });
    });
    // 条款
    router.get('/license', function *() {
      this.body = yield render('license', {
        AGREEMENT_URL: config['AGREEMENT_URL']
      });
    });
    // 手机号录入
    router.get('/doorbell', function *() {
      this.body = yield render('doorbell', {
        API_PREFIX: config['API_PREFIX']
      });
    });
    // refcode
    router.get('/refcode/:code', function *() {
      this.body = yield render('refcode', {
        PROXY_PREFIX: config['PROXY_PREFIX'],
        API_PREFIX: config['API_PREFIX'],
        LOGIN_URL: config['LOGIN_URL'],
        CODE: this.params.code
      });
    });
    // 管理员切换公司视图
    router.get('/tc', function *() {
      this.body = yield render('tc', {
        API_PREFIX: config['API_PREFIX'],
        SWITCH_URL: config['SWITCH_URL']
      });
    });

    router.get('/choice', function* (){
      this.body = yield render('choice')
    })

    router.get('/signin', function *() {
      this.body = yield render('signin', {
        LOGIN_URL: config['LOGIN_URL']
      });
    })
    return router;
  }
};
