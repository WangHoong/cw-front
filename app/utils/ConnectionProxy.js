const SocketCluster = require('socketcluster-client');
const dbg = require('debug')('topdmc:ConnectionProxy/Util');

const OnlineStateActions = require('app/actions/OnlineStateActions');

// SocketCluster Control
var _sc = null;

function _getOnlineState(){
  if(!_sc){
    return "unknown";
  }
  if(_sc.state == "open"){
    return "online";
  } else if(_sc.state == "connecting"){
    return "connecting";
  } else if(_sc.state == "closing"){
    return "closing";
  }
  return "offline";
}

function connect(options){
  options = options || {};

  // determine if https
  var sc_opt = {
    port: process.env.WS_PORT,
    hostname: process.env.WS_HOSTNAME,
    transports: ['websocket'],
    rememberUpgrade: true
  };
  if(window.DMC_IS_HTTPS == 'true'){
    dbg('using https');
    sc_opt.protocol = 'https';
    sc_opt.port = 443;
  }

  // connect if offline
  if(!_sc)
  {
    dbg('_sc opt', sc_opt);
    _sc = SocketCluster.connect(sc_opt);
    window.DMC_SC = _sc;

    OnlineStateActions.updateState('Connecting');

    // bind events
    _sc.on('connect', function(){
      dbg('sc onConnect -> ' + _sc.state);
      OnlineStateActions.updateState('Connected');
    });

    _sc.on('ready', function(status){
      // dbg('sc onReady -> ' + _sc.state);
      dbg('sc onReady -> status', status);
      if(status.isAuthenticated){
        OnlineStateActions.updateState('Authenticated');
      } else {
        OnlineStateActions.updateState('Connected but Unauthenticated');
      }
    });

    _sc.on('disconnect', function(/*p*/){
      // dbg('sc onDisconnect -> ' + _sc.state, p);
      OnlineStateActions.updateState('Disconnected');
    });

    _sc.on('error', function(err){
      dbg('on error', err);
      OnlineStateActions.updateState('Error, Disconnected');
    });

    _sc.on('setAuthToken', function(/*_token*/){
      // dbg('setAuthToken', _token);
      OnlineStateActions.updateState('Authenticated');
    });
  }

  return _sc;
}

// Connect
//connect();

module.exports = {
  connect: connect,
  conn: _sc,
  getConnectionState: _getOnlineState
};
