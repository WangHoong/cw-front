var React = require('react');
var classNames = require('classnames');
var dbg = require('debug')('topdmc:Sidebar/component');
var APIHelper = require('app/utils/APIHelper').APIHelper;
var axios = require('axios');

var NavItemLink = React.createClass({
  propTypes: {
    activeClassName: React.PropTypes.string.isRequired,
    to: React.PropTypes.string.isRequired,
    params: React.PropTypes.object,
    query: React.PropTypes.object,
    onClick: React.PropTypes.func
  },
  contextTypes: {
    router: React.PropTypes.func.isRequired
  },
  getDefaultProps: function () {
    return {
      activeClassName: 'active'
    };
  },
  getHref: function () {
    return this.context.router.makeHref(this.props.to, this.props.params, this.props.query);
  },
  getClassName: function () {
    var names = {};
    if (this.props.className) {
      names[this.props.className] = true;
    }
    if (this.context.router.isActive(this.props.to, this.props.params, this.props.query)) {
      names[this.props.activeClassName] = true;
    }
    return classNames(names);
  },

  handleRouteTo: function (event) {
    var allowTransition = true;
    var clickResult;
    if (this.props.onClick) {
      clickResult = this.props.onClick(event);
    }
    function isLeftClickEvent(event) {
      return event.button === 0;
    }
    function isModifiedEvent(event) {
      return !!(event.metaKey || event.altKey || event.ctrlKey || event.shiftKey);
    }
    if (isModifiedEvent(event) || !isLeftClickEvent(event)) {
      return;
    }
    if (clickResult === false || event.defaultPrevented === true) {
      allowTransition = false;
    }
    event.preventDefault();
    if (allowTransition) {
      this.context.router.transitionTo(this.props.to, this.props.params, this.props.query);
    }
  },
  render: function() {
    var {to, params, query, active, icon, text} = this.props;
    if (this.props.active === undefined) {
      active = this.context.router.isActive(to, params, query);
    }
    return (
      <li className={this.getClassName()}>
        <a active={active} href={this.getHref()} onClick={this.handleRouteTo} ref="linkItem">
          <i className={icon}></i>
          <span>{text}</span>
        </a>
      </li>
    );
  }
});

var ToggleMenuButton = React.createClass({
  propTypes: {
    toggleMenuClass: React.PropTypes.string.isRequired,
    handleToggleMenuClick: React.PropTypes.func
  },

  getDefaultProps: function () {
    return {
      toggleMenuClass: 'angle-double-left'
    };
  },

  render: function () {
    var toggleMenuClassName = classNames('fa', 'fa-' + this.props.toggleMenuClass);
    return (
      <a className='toggle-menu' onClick={this.props.handleToggleMenuClick}>
        <i className={toggleMenuClassName}></i>
      </a>
    );
  }
});

var Sidebar = React.createClass({
  getInitialState: function() {
    return {
      loginUserInfo: {
        avatar: 'https://s3.cn-north-1.amazonaws.com.cn/dmc-img/avatar/40039e9c-bcdf-4dbc-8827-fa8082eda648.jpg',
        name: '---',
        borderColor: '#eee'
      }
    };
  },
  getDefaultProps: function () {
    return {
      logoSrc: 'images/logo2.png',
      navItems: [
        {
          faIconName: 'home',
          text: '基本信息',
          to: 'base'
        }, {
          faIconName: 'street-view',
          text: '艺人管理',
          to: 'artists'
        }, {
          faIconName: 'edit',
          text: '专辑管理',
          to: 'albums'
        }, {
          faIconName: 'music',
          text: '曲库管理',
          to: 'songs'
        }, {
          faIconName: 'cart-plus',
          text: '曲库商店',
          to: 'store'
        }, {
          faIconName: 'bar-chart',
          text: '图表统计',
          to: 'charts'
        }, {
          faIconName: 'cogs',
          text: '系统设置',
          to: 'settings'
        }
      ]
    };
  },

  loadLoginUserInfoFromServer: function() {
    axios.get(APIHelper.getPrefix() + '/v1/online',{withCredentials: true}).then(function(res) {
      var _data = res.data;
      if (_data.data.online) {
        this.state.loginUserInfo = {
          avatar: _data.data.user['avatar'],
          name: _data.data.user['name'],
          borderColor: 'green'
        };
        this.setState(this.state);
      }
    }.bind(this));
  },

  componentDidMount: function() {
    this.loadLoginUserInfoFromServer();
  },

  render: function () {
    var navItems = this.props.navItems.map(function (item, i) {
      var className = classNames('fa', 'fa-' + item.faIconName);
      var text = item.text;
      return (
        <NavItemLink icon={className} key={i} text={text} to={item.to}/>
      );
    });
    var avatarUrl = {
      backgroundImage: 'url(' + this.state.loginUserInfo.avatar + ')',
      borderColor: this.state.loginUserInfo.borderColor
    };
    return (
      <aside className='sidebar'>
        <div className='sidebar-wrap'>
          <div className='logo'>
            <a href='/'>
              <img src={this.props.logoSrc}/>
            </a>
          </div>
          <ul className='main-menu'>{navItems}</ul>
        </div>
        <div className='sidebar-assist'>
          <div className='whoami-wrap'>
            <div className='whoami-img' style={avatarUrl}/>
            <p className="whoami-username ellipsis">{this.state.loginUserInfo.name}</p>
          </div>
          <ToggleMenuButton handleToggleMenuClick={this.props.handleToggleMenuClick} toggleMenuClass={this.props.toggleMenuClass}/>
        </div>
      </aside>
    );
  }

});

module.exports = Sidebar;
