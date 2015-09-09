import Reflux from 'reflux';
import actions from '../actions/AuthorizationActions';

module.exports = Reflux.createStore({

  listenables: [actions],

  init: function () {

  },

  getInitialState: function () {
    return {authroization: false};
  },

  /**
   * 服务端请求数据之前触发
   */
  onCreate: function () {

  },

  onCreateFailed: function (err) {
    this.trigger({
      err: err
    })
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
