"use strict";
var axios = require('axios');
import {
  APIHelper
}
from './APIHelper';
module.exports = {
  get: function() {
      return axios({
        method: 'GET',
        url: APIHelper.getPrefix() + '/authorization/replies',
        withCredentials: true
      });
    },
  update: function(id,param){
    return axios({
      url: APIHelper.getPrefix() + '/authorization/'+id+'/reply',
      method: 'PUT',
      data: param ,
      withCredentials: true
    });
  }


}
