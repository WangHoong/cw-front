var axios = require('axios');
var APIHelper = require('./APIHelper').APIHelper;
module.exports={
  find: function() {
    return axios({
      method: 'GET',
      url: APIHelper.getPrefix() + '/rpt/tracks/top/:top',
      responseType: 'json',
      withCredentials: true
    });
  },
}
