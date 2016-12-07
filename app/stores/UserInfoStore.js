var Reflux = require('reflux');
var actions = require('../actions/UserInfoActions');

module.exports = Reflux.createStore({

  listenables: [actions],

  onGet: function() {
    this.notifyUI({

    });
  },

  onGetCompleted: function(res) {
    this.notifyUI(res.data.data);
  },

  onUpdate: function() {
    this.notifyUI({

    });
  },

  onUpdateCompleted: function(res) {
    this.notifyUI(res.data);
  },

  onUpdateFailed: function(res) {
    this.notifyUI(res.data);
  },

  notifyUI: function(snaphot) {
    this.trigger(snaphot);
  },

  getInitialState: function() {
    return {
      
    };
  }

});
