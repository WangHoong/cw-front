var axios = require('axios');
var APIHelper = require('./APIHelper').APIHelper;
module.exports = {

  get: function() {
    return axios.get(APIHelper.getPrefix() + '/certification_info', {
      withCredentials: true
    });
  },
  
  update: function(data){
    return axios({
      method: 'POST',
      url: APIHelper.getPrefix() + '/certification_info',
      data,
      withCredentials: true
    });
  }

};
