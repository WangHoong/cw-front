var axios = require('axios');
var APIHelper = require('./APIHelper').APIHelper;
module.exports = {

  /**
   * 查询歌曲所有歌曲列表
   * @param  {Object} params {page: 1, size: 5}
   * @returns {axios.Promise}
   */
  // find: function(params,q) {
  //   var searchq = '';
  //   if(q){
  //     searchq = q;
  //   }
  //
  //   return axios({
  //     method: 'GET',
  //     url: 'http://dev.api.topdmc.cn/store/items?q='+searchq,
  //     responseType: 'json',
  //     params: params,
  //     withCredentials: true
  //   });
  // }
  find: function(params) {
    return axios({
      method: 'GET',
      url: 'http://dev.api.topdmc.cn/store/items',
      responseType: 'json',
      params: params,
      withCredentials: true
    });
  }
};
