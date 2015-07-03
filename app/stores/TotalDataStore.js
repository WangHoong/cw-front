var Reflux = require('reflux');
var actions = require('app/actions/TotalDataActions');

module.exports = Reflux.createStore({

  listenables: [actions],

  onGet: function(){
  },

  onGetCompleted: function(res){
    this.notifyUI(res.data.data);
  },

  notifyUI: function(payload){
    this.trigger(payload);
  },

  getInitialState: function() {
    return {
      track_total: '------',
      album_total: '----',
      artist_total: '--'
    };
  }
});
