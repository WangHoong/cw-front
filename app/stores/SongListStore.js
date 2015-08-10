"use strict";
var Reflux = require('reflux');
var actions = require('../actions/SongActions');

var songStore = Reflux.createStore({

  listenables: [actions],

  onFind: function() {
    this.notifyUI({
      items: [],
      total: 0,
      page: 0,
      totalPage: 0,
      loaded: false
    });
  },

  onFindCompleted: function(res) {
    if (res.data.page) {
      res.data.page = Math.max(0, res.data.page - 1);
    }
    res.data.data.loaded = true;
    this.notifyUI(res.data.data);
  },
  notifyUI: function(snaphot) {
    this.trigger(snaphot);
  },

  getInitialState: function() {
    return {
      items: [],
      total: 0,
      page: 0,
      totalPage: 0,
      loaded: false
    };
  }

});

module.exports = songStore;
