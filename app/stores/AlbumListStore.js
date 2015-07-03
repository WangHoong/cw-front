var Reflux = require('reflux');
var actions = require('../actions/AlbumActions');

module.exports = Reflux.createStore({

  listenables: [actions],

  /**
   * 服务端请求数据之前触发
   */
  onFind: function() {
    this.notifyUI({
      items: [],
      total: 0,
      page: 0,
      totalPage: 0
    });
  },

  /**
   * 查找完成显示数据触发
   * @param res
   */
  onFindCompleted: function(res) {
    if (res.data.page) {
      res.data.page = Math.max(0, res.data.page - 1);
    }
    res.data.data.loaded=true;
    this.notifyUI(res.data.data);
  },

  /**
   * 服务端请求数据之前触发
   */
  onSearch: function() {
    this.notifyUI({
      items: [],
      total: 0,
      page: 0,
      totalPage: 0
    });
  },

  /**
   * 查找完成显示数据触发
   * @param res
   */
  onSearchCompleted: function(res) {
    if (res.data.page) {
      res.data.page = Math.max(0, res.data.page - 1);
    }
    res.data.data.loaded=true;
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
      totalPage: 0
    };
  }

});
