var Router = require('react-router');
var React = require('react');
var analytics = require('app/utils/GoogleAnalytics');

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
var Main = require('./components/Main/Main.jsx');
// LargeFileUploader
var LargeFileUploader = require('app/components/Common/LargeFileUploader.jsx');
var {Route, RouteHandler, DefaultRoute, NotFoundRoute}=Router;
var classNames = require('classnames');

var Loader = require('app/components/Common/Loader.jsx');
var Remind = require('app/components/Common/Remind.jsx');


/**
 * axios
 * @type {axios.AxiosStatic}
 */
var axios = require('axios');


// Add a request interceptor
axios.interceptors.request.use(function (config) {
    // Do something before request is sent
    return config;
}, function (error) {
    // Do something with request error
    return Promise.reject(error);
});

// Add a response interceptor
axios.interceptors.response.use(function (response) {
    // Do something with response data
    if (response.data.status === 403) {
        window.location.href = window.DMC_OPT.LOGIN_URL;
        //window.location.href = 'http://dev.api.topdmc.cn/login';
    }
    return response;
}, function (error) {
    // Do something with response error
    return Promise.reject(error);
});

window._dbg = require('debug');
window._dbg.enable("topdmc:*");

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
                <Sidebar
                    toggleMenuClass={toggleMenuClass}
                    handleToggleMenuClick={this.handleToggleMenuClick}/>
                <section className='content' style={minHeight}>
                    <div className='content-inner'>
                        <RouteHandler />
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

        /**
         * 进行登录验证，如果没有登录，有统一的拦截器进行跳转
         */
        axios({
            url: APIHelper.getPrefix() + '/v1/online',
            responseType: 'json',
            params: {},
            withCredentials: true
        }).then(function (response) {
            if (response.data.data.online) {
              window.account_type = response.data.data.user.account_type;
              window.status = response.data.data.user.status;
              self.setState({loaded: true});
            }
        });
    },
    render() {
        if(navigator.userAgent.indexOf("Chrome")==-1){
          return(
            <Remind />
          );
        }

        if (this.state.loaded) {
            return (
                <RouteHandler/>
            );
        }
        return (<Loader/>);
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

var Settings = React.createClass({
    render: function () {
        return (
            <span>系统设置</span>
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
            <DefaultRoute handler={Main}/>
            <Route name="base" handler={Main}/>
            <Route name="artists" handler={Empty}>
                <Route name="new_artist" path="new" handler={ArtistNew}/>
                <Route name="show_edit_artist" path=":id" handler={ArtistShow}/>
                <DefaultRoute handler={Artists}/>
            </Route>
            // album route
            <Route name="albums" handler={Empty}>
                <Route name="new_album" path="new" handler={AlbumNew}/>
                <Route name="show_edit_album" path=":id" handler={AlbumShow}/>
                <DefaultRoute handler={Albums}/>
            </Route>
            // song route
            <Route name="songs" handler={Empty}>
                <Route name="new_song" path="new" handler={SongNew}/>
                <Route name="show_edit_song" path=":id" handler={SongShow}/>
                <DefaultRoute handler={Songs}/>
            </Route>
            // store route
            <Route name='store' handler={Empty}>
                <DefaultRoute handler={Store}/>
            </Route>
            <Route name="charts" handler={Chart}/>
            <Route name="settings" handler={Settings}/>
            <NotFoundRoute handler={NotFound}/>
        </Route>
    </Route>
);

Router.run(routes, function (Handler, state) {
    React.render(<Handler/>, document.body);
    analytics(state);
});
