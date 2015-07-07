"use strict";
var axios = require('axios');
import {
  APIHelper
}
from './APIHelper';

module.exports = {

  /**
   * 查询列表页
   * @param params
   * @returns {*}
   */
  find: function(params) {
    return axios({
      method: 'GET',
      url: APIHelper.getPrefix() + '/v1/tracks',
      responseType: 'json',
      params: params,
      withCredentials: true
    });
  },
  /**
   * 根据id获取歌曲信息
   * @param id
   * @returns {axios.Promise}
   */
  get: function(id) {

    return axios({
      method: 'GET',
      url: APIHelper.getPrefix() + '/v1/tracks/' + id,
      withCredentials: true
    });
  },
  /**
   * 创建歌曲信息
   * @param song
   * @returns {axios.Promise}
   */
  create: function(song) {

    return axios({
      method: 'POST',
      url: APIHelper.getPrefix() + '/v1/tracks/',
      data: song,
      withCredentials: true
    });
  },
  /**
   * 更新歌曲信息
   * @param id
   * @param song
   * @returns {axios.Promise}
   */
  update: function(id, song) {

    return axios({
      method: 'PUT',
      url: APIHelper.getPrefix() + '/v1/tracks/' + id,
      data: song,
      withCredentials: true
    });
  }
};
