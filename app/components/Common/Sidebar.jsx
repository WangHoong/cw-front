var React = require('react');
var classNames = require('classnames');
var dbg = require('debug')('topdmc:Sidebar/component');
var APIHelper = require('app/utils/APIHelper').APIHelper;
var axios = require('axios');
var _ = require('lodash');
import { Link } from 'react-router'

var NavItemLink = React.createClass({
  propTypes: {
    activeClassName: React.PropTypes.string.isRequired,
    to: React.PropTypes.string.isRequired,
    params: React.PropTypes.object,
    query: React.PropTypes.object,
    onClick: React.PropTypes.func
  },
  contextTypes: {
    history: React.PropTypes.object,
    location: React.PropTypes.object,
  },
  getDefaultProps: function() {
    return {
      activeClassName: 'active'
    };
  },
  getHref: function() {
    return this.context.router.makeHref(this.props.to, this.props.params, this.props.query);
  },
  getClassName: function() {
    var names = {};
    if (this.props.className) {
      names[this.props.className] = true;
    }
    if (this.context.history.isActive(this.props.to, this.context.location.query)) {
      names[this.props.activeClassName] = true;
    }
    return classNames(names);
  },

  handleRouteTo: function(event) {
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
      this.context.history.pushState(null, `${this.props.to}`, this.context.location.query);
    }
  },
  render: function() {
    // console.log(this)
    var {to, params, query, active, icon, text, fullSideBar} = this.props;
    if (this.props.active === undefined) {
      active = this.context.history.isActive(this.context.location.pathname, this.context.location.query)
    }
    var tooltip = !fullSideBar ? {'data-tooltip': text} : '';
    // return (
    //   <li className={this.getClassName()}>
    //     <a active={active} {...tooltip} href={this.getHref()} onClick={this.handleRouteTo} ref="linkItem">
    //       <i className={icon}></i>
    //       <span>{text}</span>
    //     </a>
    //   </li>
    // );
    return (
      <li className={this.getClassName()}>
        <Link {...tooltip} to={`/${this.props.to}`} onClick={this.handleRouteTo}>
          <i className={icon}></i>
          <span>{text}</span>
        </Link>
      </li>
    );
  }
});

var ToggleMenuButton = React.createClass({
  propTypes: {
    toggleMenuClass: React.PropTypes.string.isRequired,
    handleToggleMenuClick: React.PropTypes.func
  },

  getDefaultProps: function() {
    return {
      toggleMenuClass: 'angle-double-left'
    };
  },

  render: function() {
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
  getDefaultProps: function() {
    return {
      logoSrc: 'images/new_logo.png',
    };
  },

  loadLoginUserInfoFromWindow: function() {
    if (window.currentUser.name && window.currentUser.avatar) {
      this.setState({
        loginUserInfo: {
          avatar: window.currentUser.avatar,
          name: window.currentUser.name,
          borderColor: 'green'
        }
      });
    }
    // var onlineURL = APIHelper.getPrefix().replace('api', '') + 'online';
    // axios.get(onlineURL, {withCredentials: true}).then(function(res) {
    //   var _data = res.data;
    //   if (_data.data.online) {
    //     this.state.loginUserInfo = {
    //       avatar: _data.data.user['avatar'],
    //       name: _data.data.user['name'],
    //       borderColor: 'green'
    //     };
    //     this.setState(this.state);
    //   }
    // }.bind(this));
  },

  componentDidMount: function() {
    this.loadLoginUserInfoFromWindow();

  },

  logout: function(evt) {
    evt.preventDefault();
    var logoutUrl = APIHelper.getPrefix().replace(/api$/, '') + '/logout';
    axios.get(logoutUrl, {withCredentials: true}).then(function(res) {
      if (res.data.status == 200) {
        window.location.href = '/';
      }
    });
  },

  render: function() {
    const isSP = localStorage.getItem('isSP') === 'true'
    let cpItems  = [
      {
        faIconName: 'home',
        text: window.lang.bi,
        to: 'base',
        roleName: ['CP']
      },
      {
        faIconName: 'street-view',
        text: window.lang.ar,
        to: 'artists',
        roleName: ['CP','SP']
      }, {
        faIconName: 'edit',
        text: window.lang.al,
        to: 'albums',
        roleName: ['CP','SP']
      }, {
        faIconName: 'music',
        text: window.lang.tr,
        to: 'songs',
        roleName: ['CP','SP']
      }, {
        faIconName: 'bar-chart',
        text: window.lang.re,
        to: 'charts',
        roleName: ['CP','SP']
      }, {
        faIconName: 'cogs',
        text: window.lang.se,
        to: 'settings',
        roleName: ['CP','SP']
      }
    ];

    let spItems  = [
      {
        faIconName: 'home',
        text: window.lang.bi,
        to: 'sp',
        roleName: ['SP']
      }, {
        faIconName: 'exchange',
        text: window.lang.licensing,
        to: 'authorization',
        roleName: ['SP']
      },
      {
        faIconName: 'cogs',
        text: window.lang.se,
        to: 'settings',
        roleName: ['CP','SP']
      }
    ];

    let navItems = cpItems;
    if (isSP){
      navItems = spItems;
    }

    /**
     * 根据用户过滤菜单列表 by yali
     */

    navItems = navItems.map(function(item, i) {
      var className = classNames('fa', 'fa-' + item.faIconName);
      var text = item.text;
      return (
        <NavItemLink fullSideBar={this.props.fullSideBar} icon={className} key={i} text={text} to={item.to}/>
      );
    }.bind(this));
    var avatarUrl = {
      backgroundImage: 'url(' + this.state.loginUserInfo.avatar + ')',
      borderColor: this.state.loginUserInfo.borderColor
    };
    const HOMELINK = isSP ? '/#/sp' : '/'
    return (
      <aside className='sidebar'>
        <div className='sidebar-wrap'>
          <div className='logo'>
            <a href={HOMELINK}>
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
          <a href='#' onClick={this.logout} style={{display: 'block', height: '30px', lineHeight: '30px', textAlign: 'center'}}>{window.lang.logout}</a>
        </div>
      </aside>
    );
  }

});

module.exports = Sidebar;
