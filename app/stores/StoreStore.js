var Reflux = require('reflux');
var assign = require('object-assign');
var actions = require('../actions/StoreActions');

/**
 * 歌手Store
 */
module.exports = Reflux.createStore({
  listenables: [actions],

  init: function () {
    this.store = {
      data: {
        items: []
      },
      loaded: false
    };
  },

  onFind: function() {
    this.store.data = {
      items: []
    };
    this.store.loaded = true;
    this.trigger(this.store);
  },

  onFindCompleted: function(res){
    this.store.data = res.data.data;
    this.store.loaded = true;
    this.trigger(this.store);
  },

  getInitialState: function () {
    return this.store;
  }
});
