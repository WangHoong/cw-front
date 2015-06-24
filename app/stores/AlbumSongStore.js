/*global Reflux*/
// var Reflux = require('reflux');
var actions = require('../actions/AlbumActions');

module.exports = Reflux.createStore({
  listenables: [actions],

  init: function () {
    this.songList = {
      items: []
    };
  },

  getInitialState: function() {
    return this.songList;
  },

  // 根据id获取专辑完成
  onGetSongsCompleted: function(res) {
    this.updateUI(res.data);
  },

  updateUI: function(songList) {
    this.songList = songList;
    this.trigger(this.songList);
  }

});
