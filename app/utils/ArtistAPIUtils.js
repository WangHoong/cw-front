"use strict";
var axios = require('axios');
import {
  APIHelper
}
from './APIHelper';

module.exports = {
  /**
   * 查找歌手列表
   * @param params
   * {
   *  page :1
   *  size:5,
   *  name:'',
   *  country:'
   * }
   * @returns {axios.Promise}
   */
  find: function(params) {

    return axios({
      url: APIHelper.getPrefix() + '/v1/artists',
      responseType: 'json',
      params: params,
      withCredentials: true
    });
  },

  /**
   * 查找歌手列表
   * @param params
   * {
   *  page :1
   *  size:5,
   *  name:'',
   *  country:'
   * }
   * @returns {axios.Promise}
   */
  search: function(params) {

    return axios({
      url: APIHelper.getPrefix() + '/v1/artists/search',
      responseType: 'json',
      params: params,
      withCredentials: true
    });
  },

  /**
   * 根据Id获取歌手信息
   * @param id {Number}
   * @returns {axios.Promise}
   */
  get: function(id) {
    return axios.get(APIHelper.getPrefix() + '/v1/artists/' + id, {
      withCredentials: true
    });
  },

  /**
   * 更新歌手信息
   * @param id {Number}
   * @param attributes {Object}
   * @returns {axios.Promise}
   */
  update: function(id, attributes) {
    return axios({
      url: APIHelper.getPrefix() + '/v1/artists/' + id,
      data: attributes,
      method: 'PUT',
      withCredentials: true
    });
  },

  /**
   * 创建新歌手
   * @param artist {Object}
   * @returns {axios.Promise}
   */
  create: function(artist) {
    return axios({
      url: APIHelper.getPrefix() + '/v1/artists/',
      data: artist,
      method: 'POST',
      withCredentials: true
    });
  },

  /**
   * 获取所有歌手的国籍信息
   * @param id {Number}
   * @param attributes {Object}
   * @returns {axios.Promise}
   */
  countries: function() {
    return axios.get(APIHelper.getPrefix() + '/v1/artists/countries', {withCredentials: true});
  }
};
