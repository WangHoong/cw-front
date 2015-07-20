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
      data: {},
      loaded: false
    };
  }
});
