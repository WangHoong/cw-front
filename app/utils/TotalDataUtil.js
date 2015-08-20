var axios = require('axios');
var APIHelper = require('./APIHelper').APIHelper;

module.exports = {
  get: function(){
    return axios.get(APIHelper.getPrefix() + '/statistics', {
      withCredentials: true
    });
  }
};
