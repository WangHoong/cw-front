'use strict';
var axios = require('axios');
let dbg = require('debug')('topdmc:SearchBox/Util');

import {
  APIHelper
}
from './APIHelper';

let getSearchType = function(type) {
  if (type == 'Album') {
    return 'albums/searchall';
  }
  if (type == 'Song') {
    return 'tracks/searchall';
  }
  if (type == 'Artist') {
    return 'artists/searchall';
  }
  return '';
};


module.exports = {
  search: function(keyword, type) {
    var _searchType = getSearchType(type);
    dbg('search', 'keyword=' + keyword + ', type' + type);
    return axios({
      url: APIHelper.getPrefix() + '/' + _searchType,
      responseType: 'json',
      params: {
        size: 50,
        q: keyword
      },
      withCredentials: true
    });
  }
};
