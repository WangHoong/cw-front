import Reflux from 'reflux';
import assign from 'assign';
import actions from '../actions/AuthorizationActions';

module.exports = Reflux.createStore({

  listenables: [actions],

  init: function () {

  },

  getInitialState: function () {

  },

  /**
   * 服务端请求数据之前触发
   */
  onCreate: function () {

  },

  /**
   * 查找完成显示数据触发
   * @param res
   */
  onCreateCompleted: function (res) {

    //this.tigger({
    //  created: true
    //});
  }
});
