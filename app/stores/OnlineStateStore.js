/*global Reflux*/
//const dbg = require('debug')('topdmc:OnlineStateStore/Store');
const ConnectionProxy = require('app/utils/ConnectionProxy');
const OnlineStateActions = require('app/actions/OnlineStateActions');

ConnectionProxy.connect();

exports = module.exports = Reflux.createStore({
  listenables: OnlineStateActions,

  onUpdateState: function(p){
    // dbg('onUpdateState', p);
    this.onlineState = p;
    this.trigger(p);
  },

  getInitialState: function(){
    // dbg('getInitialState', this.onlineState);
    return this.onlineState;
  }
});
