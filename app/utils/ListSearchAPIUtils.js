'use strict';
var axios = require('axios');
var APIHelper = require('./APIHelper').APIHelper;

module.exports = {
  /**
   * 查询歌手列表
   * @param {Object} params
   * @returns {axios.Promise}
   */
  search: function(params) {
    return axios({
      method: 'GET',
      url: APIHelper.getPrefix() + '/v1/autocomplete',
      responseType: 'json',
      params: params,
      withCredentials: true
    });
  }
};
