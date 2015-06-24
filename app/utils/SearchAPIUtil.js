/* global axios */
'use strict';

let dbg = require('debug')('topdmc:SearchBox/Util');

import {
  APIHelper
}
from './APIHelper';

let getSearchType = function(type) {
  if (type == 'Album') {
    return 'albums';
  }
  if (type == 'Song') {
    return 'tracks';
  }
  if (type == 'Artist') {
    return 'artists';
  }
  return '';
};


module.exports = {
  search: function(keyword, type) {
    var _searchType = getSearchType(type);
    dbg('search', 'keyword=' + keyword + ', type' + type);
    return axios({
      url: APIHelper.getPrefix() + '/v1/' + _searchType,
      responseType: 'json',
      params: {
        size: 50,
        q: keyword
      },
      withCredentials: true
    });
  }
};
