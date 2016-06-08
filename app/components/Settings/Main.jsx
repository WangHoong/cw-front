var React = require('react');
var Reflux = require('reflux');
var SettingsStore = require('../../stores/SettingsStore');
var SettingsActions = require('../../actions/SettingsActions');
var UserSwitch = require('./UserSwitch.jsx')
var CreateInviteLink = require('./CreateInviteLink.jsx')

var NAVSWITCH = 'switch'
var NAVCILINK = 'cilink'

var Main = React.createClass({
  mixins: [Reflux.connect(SettingsStore, 'companies')],
  getInitialState: function() {
    return {
      navAt: NAVSWITCH
    };
  },
  componentDidMount: function () {
    // SettingsActions.find()
  },
  navAction: function (nav) {
    var that = this
    return function () {
      that.setState({
        navAt: nav
      })
    }
  },
  render: function(){
    var nav = (
      <nav className="nav navbar navbar-default">
      <div className="collapse navbar-collapse" style={{background: "white"}}>
        <ul className="nav navbar-nav">
          <li style={this.state.navAt === NAVSWITCH ? {fontWeight:"bold"} : {}}><a href='javascript:void(0)' onClick={this.navAction(NAVSWITCH)} >User Switch</a></li>
          <li style={this.state.navAt === NAVCILINK ? {fontWeight:"bold"} : {}}><a href='javascript:void(0)' onClick={this.navAction(NAVCILINK)} >Create Invite Link</a></li>
        </ul>
      </div>
      </nav>
    )
    var hasInvitation =  window.has_invitation === 1 ? true : false
    var settingBody;
    if ( this.state.navAt === NAVSWITCH ) {
      settingBody = <UserSwitch />
    } else if ( this.state.navAt === NAVCILINK ) {
      settingBody = <CreateInviteLink />
    } else {
      settingBody = <UserSwitch />
    }

    return (
      <div>
        { hasInvitation && nav }
        { settingBody }
      </div>
    )
  }
})
module.exports = Main;
