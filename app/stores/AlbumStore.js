var Reflux = require('reflux');
var actions = require('../actions/AlbumActions');
var assign = require('object-assign');

module.exports = Reflux.createStore({
  listenables: [actions],

  init: function () {
    this.album = {
      data: {}
    };
  },

  getInitialState: function() {
    return this.album;
  },

  // 根据id获取专辑完成回调
  onGetCompleted: function(res) {
    this.updateUI({
      data: res.data.data,
      loaded: true
    });
  },

  onUpdate: function(id, attributes) {
    this.album.data = assign(this.album.data.data || {}, attributes);
    this.updateUI({
      data: this.album.data,
      updated: false
    });
  },

  // 更新完成
  onUpdateCompleted: function() {
    this.updateUI({
      data: this.album.data,
      updated: true
    });
  },

  /**
   * 更新前进行本地的赋值
   * @param album
   */
  onCreate: function(album) {
    this.album.data = album.data.data;
    this.updateUI({
      data: this.album.data,
      created: false
    });
  },

  /**
   * 新建专辑完成后
   * @param res
   */
  onCreateCompleted: function(res) {
    this.album.data.id = res.data.id;
    this.updateUI({
      data: this.album.data,
      created: true
    });
  },
  onBulid: function(attributes){
    this.album.data = assign(this.album.data.data || {}, attributes);
    this.updateUI({
      data: this.album.data,
      bulided: false
    });


  },
  onBulidCompleted: function (obj) {
    var currentData = obj.data.data;
    this.updateUI({
      data: this.album.data,
      bulided: true
    });
    //console.log(this.album);
    //console.log(obj);
  },

  updateUI: function(album) {
    this.trigger(album);
  }

});
