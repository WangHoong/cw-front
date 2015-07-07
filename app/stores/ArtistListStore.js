"use strict";
var Reflux = require('reflux');
var actions = require('../actions/ArtistActions');

var artistStore = Reflux.createStore({

    listenables: [actions],

    /**
     * 服务端请求数据之前触发
     */
    onFind: function () {
        this.notifyUI({
            items: [],
            total: 0,
            page: 0,
            totalPage: 0
        });
    },

    /**
     * 查找完成显示数据触发
     * @param res
     */
    onFindCompleted: function (res) {
        if (res.data.data.page) {
            res.data.data.page = Math.max(0, res.data.data.page - 1);
        }

        res.data.data.loaded=true;
        this.notifyUI(res.data.data);
    },

    /**
     * 服务端请求数据之前触发
     */
    onSearch: function () {
        this.notifyUI({
            items: [],
            total: 0,
            page: 0,
            totalPage: 0
        });
    },

    /**
     * 查找完成显示数据触发
     * @param res
     */
    onSearchCompleted: function (res) {
        if (res.data.data.page) {
            res.data.data.page = Math.max(0, res.data.data.page - 1);
        }

        res.data.data.loaded=true;
        this.notifyUI(res.data.data);
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
        return {
            items: [],
            total: 0,
            page: 0,
            totalPage: 0
        };
    }

});

module.exports = artistStore;
