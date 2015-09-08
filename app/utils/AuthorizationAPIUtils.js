import axios from 'axios';
import {APIHelper} from './APIHelper';

module.exports = {

  create: function(model) {
    return axios({
      url: APIHelper.getPrefix() + '/authorization',
      data: model,
      method: 'POST',
      withCredentials: true
    });
  }
};
