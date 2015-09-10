import Reflux from 'reflux';
import actions from '../actions/AuthorizationActions';

module.exports = Reflux.createStore({

  listenables: [actions],

  init: function () {
    this.data = {
      authorization: undefined
    };
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
    this.data.authorization = res.data.data;
    this.trigger(this.data);
  },

  /**
   * 获取授权信息
   */
  onGet: function () {

  },

  /**
   * 获取授权信息结束
   */
  onGetCompleted: function (res) {

    this.data.authorization = res.data.data;
    this.trigger(this.data);
  }
});
