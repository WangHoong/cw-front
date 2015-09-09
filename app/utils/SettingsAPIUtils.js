"use strict";
var axios = require('axios');
import {
  APIHelper
}
from './APIHelper';
module.exports = {
  find: function() {
    return axios({
      method: 'GET',
      url: APIHelper.getPrefix() +'/companies/children',
      responseType: 'json',
      withCredentials: true
    });
  },
  get: function(id) {
      return axios({
        method: 'GET',
        url: APIHelper.getPrefix() + '/companies/' + id +'/inspect',
        withCredentials: true
      });
    }
}
