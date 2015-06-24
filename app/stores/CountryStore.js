/*global Reflux*/
"use strict";

// var Reflux = require('reflux');
var actions = require('../actions/ArtistActions');

var countryStore = Reflux.createStore({

    listenables: [actions],

    /**
     * 查找完成显示数据触发
     * @param res
     */
    onCountriesCompleted: function (res) {
        this.notifyUI(res.data);
    },

    /**
     * 更新歌手列表信息
     * @param artistsSnaphot
     * @private
     */
    notifyUI: function (snaphot) {
        this.trigger(snaphot);
    },

    getInitialState: function () {
        return [];
    }

});

module.exports = countryStore;
