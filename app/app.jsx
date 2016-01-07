//rr1.x var Router = require('react-router');
import { Router, Route, IndexRoute } from 'react-router'
var React = require('react');
import { render } from 'react-dom'
import createBrowserHistory from 'history/lib/createBrowserHistory'
let history = createBrowserHistory()
var analytics = require('app/utils/GoogleAnalytics');

// authorization

var Authorization = require('./components/Authorization/Main.jsx');

var Sidebar = require('./components/Common/Sidebar.jsx');
// artist
var Artists = require('./components/Artists/Main.jsx');
var ArtistShow = require('./components/Artists/Show.jsx');
var ArtistNew = require('./components/Artists/New.jsx');
// albums
var Albums = require('./components/Albums/Main.jsx');
var AlbumShow = require('./components/Albums/Show.jsx');
var AlbumNew = require('./components/Albums/New.jsx');
// songs
var Songs = require('./components/Songs/Main.jsx');
var SongNew = require('./components/Songs/New.jsx');
var SongShow = require('./components/Songs/Show.jsx');
// store
var Store = require('./components/Store/Main.jsx');
// searchBox
var SearchBox = require('./components/SearchBox/Main.jsx');
// Whoami
var Whoami = require('app/components/Common/Whoami.jsx');
var CP = require('./components/Main/CP.jsx');
var SP = require('./components/Main/SP.jsx');

// LargeFileUploader
var LargeFileUploader = require('app/components/Common/LargeFileUploader.jsx');

var classNames = require('classnames');

var Loader = require('app/components/Common/Loader.jsx');
var axios = require('axios');
var Settings = require('./components/Settings/Main.jsx');
var OrderInfo = require('./components/OrderInfo/OrderInfo.jsx');
var WeekTopSongs = require('./components/TopSongs/Main.jsx');

var Cookies = require('js-cookie');

import numeral from 'numeral';

const language = {
  delimiters: {
    thousands: ',',
    decimal: '.'
  },
  abbreviations: {
    thousand: '千',
    million: '百万',
    billion: '十亿',
    trillion: '兆'
  },
  ordinal: function (number) {
    return '.';
  },
  currency: {
    symbol: '¥'
  }
};

numeral.language('chs', language);
numeral.language('chs');

require('./utils/HTTPLog');
window._dbg = require('debug');
let CleanDebugForProdModeUrl = 'www.topdmc.com'
CleanDebugForProdModeUrl === location.hostname ? _dbg.disable() : _dbg.enable("topdmc:*")
axios.interceptors.request.use(function(config) {
  config.params = config.params || {};
  config.params['_t'] = new Date().getTime();
  return config;
});

var App = React.createClass({
  contextTypes: {
    router: React.PropTypes.func
  },

  getInitialState: function () {
    return {
      fullSideBar: false
    };
  },

  getViewPortHeight: function () {
    return document.documentElement.clientHeight || document.body.clientHeight;
  },

  handleToggleMenuClick: function () {
    this.state.fullSideBar = !this.state.fullSideBar;
    this.setState(this.state);
  },

  setLanguage: function(language) {
    Cookies.set('_l', language, {expires: 365});
    location.reload();
  },

  render: function () {
    //var routes = this.context.router.getCurrentRoutes();
    // console.log(this)
    var toggleMenuClass = this.state.fullSideBar ? 'angle-double-left' : 'angle-double-right';
    var appclassname = classNames('app-container', {
      'show-sidebar': this.state.fullSideBar
    });
    var minHeight = {
      minHeight: this.getViewPortHeight() + 'px'
    };

    return (
      <div className={appclassname}>
        <Sidebar fullSideBar={this.state.fullSideBar} handleToggleMenuClick={this.handleToggleMenuClick} toggleMenuClass={toggleMenuClass}/>
        <section className='content' style={minHeight}>
          <div className='content-inner'>
            {this.props.children}
          </div>
          <footer className='footer'>
            <p className='pull-right'>
              <span className='mr10'>{window.lang.Language}:</span>
              <a className='mr10' onClick={this.setLanguage.bind(this, 'en')}>English</a>
              <a onClick={this.setLanguage.bind(this, 'zh')}>中文</a>
            </p>
            <p className='copyright'>Copyright &copy; 2015 北京成为科技有限公司 京ICP备15018286号</p>
          </footer>
        </section>
      </div>
    );
  }
});

/**
 * 添加首页启动界面判断用户是否登录，和进行加载
 * @type {*|Function}
 */
var StartPage = React.createClass({

  getInitialState: function () {
    return {
      loaded: false
    };
  },

  componentDidMount: function () {

    var self = this;
    var APIHelper = require('./utils/APIHelper').APIHelper;
    var onlineURL = APIHelper.getPrefix() + '/online';

    /**
    * 进行登录验证，如果没有登录，有统一的拦截器进行跳转
    */
    axios.get(onlineURL, {withCredentials: true}).then(function(response) {
      if (response.data.data.online===true) {
        window.currentUser = response.data.data.user || {role_names:[]};

        if ((window.currentUser.role_names.length ===1) && (window.currentUser.role_names[0] === 'SP')) {
          localStorage.setItem('isSP', 'true');
        }
        if ((window.currentUser.role_names.length ===1) && (window.currentUser.role_names[0] === 'CP')) {
          localStorage.setItem('isSP', 'false');
        }
        window.account_type = window.currentUser.account_type;
        window.status = window.currentUser.status;
        self.setState({
          loaded: true
        });
      } else {
        window.location.href = '/home';
      }
    });
  },
  render() {
    if (this.state.loaded) {
      return (
        <div>{this.props.children}</div>
      );
    }
    return (
      <Loader />
    );
  }
});

var Base = React.createClass({
  contextTypes: {
    router: React.PropTypes.func
  },

  componentDidMount: function () {
    this.context.router.transitionTo('base');
  },

  render: function () {
    var id = this.context.router.getCurrentParams().id;

    var params = this.context.router.getCurrentQuery();

    return (
      <span/>
    );
  }
});

var Chart = React.createClass({
  render: function () {
    return (
      <span>{window.lang.re}</span>
    );
  }
});

var NotFound = React.createClass({
  render: function () {
    return (
      <span>404 NotFound</span>
    );
  }
});

var Empty = React.createClass({
  render: function () {
    return (
      <div>{this.props.children}</div>
    );
  }
});

var routes = (
  <Route component={StartPage} path="/">
    <Route component={App}>
      <IndexRoute component={CP}/>
      <Route component={CP} path="base"/>
      <Route component={Empty} path="artists">
        <Route component={ArtistNew} path="new"/>
        <Route component={ArtistShow} path=":id"/>
        <IndexRoute component={Artists}/>
      </Route>
      // album route
      <Route component={Empty} path="albums">
        <Route component={AlbumNew} path="new"/>
        <Route component={AlbumShow} path=":id"/>
        <IndexRoute component={Albums}/>
      </Route>
      // song route
      <Route component={Empty} path="songs">
        <Route component={SongNew} path="new"/>
        <Route component={SongShow} path=":id"/>
        <IndexRoute component={Songs}/>
      </Route>
      // WeekTopSongs
      <Route component={Empty} path="songtop100">
        <IndexRoute component={WeekTopSongs} />
      </Route>
      // store route
      <Route component={Empty} path="store">
        <IndexRoute component={Store}/>
      </Route>
      <Route component={Empty} path="authorization">
        <IndexRoute component={Authorization}/>
      </Route>
      <Route component={Empty} path="settings">
        <IndexRoute component={Settings}/>
      </Route>
      <Route component={Empty} path="orderinfo">
        <IndexRoute component={OrderInfo}/>
      </Route>
      <Route component={Chart} path="charts"/>

      <Route component={SP} path="sp"/>

      <Route path="*" component={NotFound}/>
    </Route>
  </Route>
);

//rr1.x TODO: analytics(state);
render(<Router history={history} routes={routes} />, document.querySelector('#mountNode'))
  //rr1.x Router.run(routes, function (component, state) {
  //   React.render(<component/>, document.querySelector('#mountNode'));
  //   analytics(state);
  // });
