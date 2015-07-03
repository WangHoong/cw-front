var Reflux = require('reflux');
var ListSearchActions = require('../actions/ListSearchActions');

var ListSearchStore = Reflux.createStore({
  listenables: [ListSearchActions],

  init: function() {
    this.data = {};
    this.data.state = 'DISABLED';
  },

  getInitialState: function() {
    return this.data;
  },

  onSearch: function() {
    this.data.results = [];
    this.data.state = 'SEARCHING';
    this.trigger(this.data);
  },

  onSearchCompleted: function(results) {
    this.data.results = results.data.data.artist;
    this.data.state = 'DONE';
    this.trigger(this.data);
  },

  onToggledShow: function(isShow) {
    this.data.isShow = isShow
    this.trigger(this.data);
  },

  // 清除数据
  onClear: function() {
    this.data.results = [];
    this.data.state = 'DISABLED';
    this.trigger(this.data);
  }

});

module.exports = ListSearchStore;
