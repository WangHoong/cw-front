var Router = require('react-router');
var React = require('react');
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
var {Route, RouteHandler, DefaultRoute, NotFoundRoute} = Router;
var classNames = require('classnames');

var Loader = require('app/components/Common/Loader.jsx');
var axios = require('axios');
var Settings = require('./components/Settings/Main.jsx');
var OrderInfo = require('./components/OrderInfo/OrderInfo.jsx');
var WeekTopSongs = require('./components/TopSongs/Main.jsx');

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
  config.url = config.url + '?t=' + (+new Date());
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

  render: function () {
    var routes = this.context.router.getCurrentRoutes();

    var toggleMenuClass = this.state.fullSideBar ? 'angle-double-left' : 'angle-double-right';
    var appClassName = classNames('app-container', {
      'show-sidebar': this.state.fullSideBar
    });
    var minHeight = {
      minHeight: this.getViewPortHeight() + 'px'
    };

    return (
      <div className={appClassName}>
        <Sidebar fullSideBar={this.state.fullSideBar} handleToggleMenuClick={this.handleToggleMenuClick} toggleMenuClass={toggleMenuClass}/>
        <section className='content' style={minHeight}>
          <div className='content-inner'>
            <RouteHandler/>
          </div>
          <footer className='footer'>
            <p className='copyright'>
              Copyright &copy; 2015 北京成为科技有限公司 京ICP备15018286号
            </p>
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
    var onlineURL = APIHelper.getPrefix().replace(/api$/, '') + '/online';

    /**
    * 进行登录验证，如果没有登录，有统一的拦截器进行跳转
    */
    axios.get(onlineURL, {withCredentials: true}).then(function(response) {
      
      if (response.data.data.online===true) {
        window.currentUser = response.data.data.user || {role_names:[]};
        localStorage.setItem('isSP', 'false');
        if ((window.currentUser.role_names.length ===1) && (window.currentUser.role_names[0] === 'SP')) {
          localStorage.setItem('isSP', 'true');
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
        <RouteHandler />
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
      <span>图表统计</span>
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
      <RouteHandler/>
    );
  }
});

var routes = (
  <Route handler={StartPage} path="/">
    <Route handler={App}>
      <DefaultRoute handler={CP}/>
      <Route handler={CP} name="base"/>
      <Route handler={Empty} name="artists">
        <Route handler={ArtistNew} name="new_artist" path="new"/>
        <Route handler={ArtistShow} name="show_edit_artist" path=":id"/>
        <DefaultRoute handler={Artists}/>
      </Route>
      // album route
      <Route handler={Empty} name="albums">
        <Route handler={AlbumNew} name="new_album" path="new"/>
        <Route handler={AlbumShow} name="show_edit_album" path=":id"/>
        <DefaultRoute handler={Albums}/>
      </Route>
      // song route
      <Route handler={Empty} name="songs">
        <Route handler={SongNew} name="new_song" path="new"/>
        <Route handler={SongShow} name="show_edit_song" path=":id"/>
        <DefaultRoute handler={Songs}/>
      </Route>
      // WeekTopSongs
      <Route handler={Empty} name='songtop100'>
        <DefaultRoute handler={WeekTopSongs} />
      </Route>
      // store route
      <Route handler={Empty} name='store'>
        <DefaultRoute handler={Store}/>
      </Route>
      <Route handler={Empty} name='authorization'>
        <DefaultRoute handler={Authorization}/>
      </Route>
      <Route handler={Empty} name='settings'>
        <DefaultRoute handler={Settings}/>
      </Route>
      <Route handler={Empty} name='orderinfo'>
        <DefaultRoute handler={OrderInfo}/>
      </Route>
      <Route handler={Chart} name="charts"/>

      <Route handler={SP} name="sp"/>

      <NotFoundRoute handler={NotFound}/>
    </Route>
  </Route>
);

  Router.run(routes, function (Handler, state) {
    React.render(<Handler/>, document.body);
    analytics(state);
  });
