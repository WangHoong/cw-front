// routes.js - houjiazong, 2015/08/11
var router = require('koa-router')();
var config = require('config');
var render = require('./render');
var version = require('../package.json').version;
var request = require('co-request');
var randomStr = require('random-string');

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
      var online_url = config['PROXY_PREFIX'] ? config['PROXY_PREFIX'] + '/api/v1/online' : 'https://api.topdmc.com/api/v1/online';
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
        return this.redirect(this.querystring ? '/home' + '?' + this.querystring : '/home');
      }

      this.body = yield render('index', {
        API_PREFIX: config['API_PREFIX'],
        LOGIN_URL: config['LOGIN_URL'],
        UPLOAD_FILE_URL: config['UPLOAD_FILE_URL'],
        version: version,
        lang: JSON.stringify(require(__dirname +'/../i18n/' + this.__language).app),
        title: require(__dirname +'/../i18n/' + this.__language).app.Title,
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
      var index
      if (this.__language==='en') {
        index = 'global_topdmc'
      }else if(this.__language==='zh') {
        index = 'topdmc'
      }
      this.body = yield render(index, {
        API_PREFIX: config['API_PREFIX'],
        LOGIN_URL: config['LOGIN_URL'],
        querystring: this.querystring,
        lang: require(__dirname +'/../i18n/' + this.__language).home,
      });
    });
    // 条款
    router.get('/license', function *() {
      var license
      if (this.__language==='en') {
        license = 'global_license'
      }else if(this.__language==='zh') {
        license = 'license'
      }
      this.body = yield render(license, {
        AGREEMENT_URL: config['AGREEMENT_URL'] + `?${this.querystring}`
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
    });

    router.get('/signin', function* () {
      var isGlobal = /global\.topdmc\.com/.test(this.request.header.host)
      if (isGlobal) {
        this.body = yield render('global_signin', {
          API_PREFIX: config['API_PREFIX']
        })
      } else {
        this.body = yield render('cn_signin', {
          API_PREFIX: config['API_PREFIX']
        })
      }
    });

    router.get('/signup', function* () {
      var isGlobal = /global\.topdmc\.com/.test(this.request.header.host)
      if (isGlobal) {
        this.body = yield render('global_signup', {
          API_PREFIX: config['API_PREFIX']
        })
      } else {
        this.body = yield render('cn_signup', {
          API_PREFIX: config['API_PREFIX']
        })
      }
    })

    router.get('/wx_signin', function* (){
      this.body = yield render('wechat_signin', {
        QRCODE_URL: config['QRCODE_URL'] + '?' + this.querystring,
        LOGIN_URL: config['LOGIN_URL']
      });
    })

    // 关于我们
    router.get('/about', function *() {
      var index
      if (this.__language==='en') {
        index = 'global_about'
      }else if(this.__language==='zh') {
        index = 'about'
      }
      this.body = yield render(index, {
        version: version,
        lang: require(__dirname +'/../i18n/' + this.__language).home
      });
    });
    // 招聘信息
    router.get('/careers', function *() {
      this.body = yield render('careers', {
        version: version,
        lang: require(__dirname +'/../i18n/' + this.__language).home
      });
    });
    // 联系我们
    router.get('/contactus', function *() {
      var index
      if (this.__language==='en') {
        index = 'global_contactus'
      }else if(this.__language==='zh') {
        index = 'contactus'
      }
      this.body = yield render(index, {
        version: version,
        lang: require(__dirname +'/../i18n/' + this.__language).home
      });
    });
    return router;
  }
};
