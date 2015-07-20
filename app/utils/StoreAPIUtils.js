var axios = require('axios');
var APIHelper = require('./APIHelper').APIHelper;
module.exports = {

  /**
   * 查询歌曲所有歌曲列表
   * @param  {Object} params {page: 1, size: 5}
   * @returns {axios.Promise}
   */
  find: function(params) {
    return axios({
      url: APIHelper.getPrefix() + '/v1/albums?q='+searchq,
      responseType: 'json',
      params: params,
      withCredentials: true
    });
  }
};
