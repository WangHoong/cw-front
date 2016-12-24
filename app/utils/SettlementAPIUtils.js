'use strict';
var axios = require('axios');
var APIHelper = require('./APIHelper').APIHelper;

module.exports = {
  /**
   * 查询结果单列表
   * @param {Object} params
   * @returns {axios.Promise}
   */
  find: function(params) {
    return axios({
      method: 'GET',
      url: APIHelper.getPrefix() + '/bills',
      responseType: 'json',
      params: params,
      withCredentials: true
    });
  }
};
