/* global Reflux */

var actions = require('../actions/SearchBoxActions');
// var dbg = require('debug')('app:SearchBoxStore');

module.exports = exports = Reflux.createStore({

  listenables: [actions],

  onSearch: function (txt, type) {
    this.type=type;
    this.trigger({
      results: [],
      state: 'SEARCHING'
    });
  },

  onSearchCompleted: function (result) {
    this.trigger({
      results: result.data.data.items,
      type: this.type,
      state: 'DONE'
    });
  },

  getInitialState: function () {
    return {};
  }
});
