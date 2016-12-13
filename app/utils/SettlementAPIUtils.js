'use strict';
var axios = require('axios');
var APIHelper = require('./APIHelper').APIHelper;

module.exports = {
  /**
   * 查询歌手列表
   * @param {Object} params
   * @returns {axios.Promise}
   */
  find: function(params) {
    return axios({
      method: 'GET',
      url: 'http://api.dev.topdmc.com.cn/api/bills',
      responseType: 'json',
      params: params,
      withCredentials: true
    });
  }
};
