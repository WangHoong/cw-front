/*global Reflux*/
var assign = require('object-assign');
var actions = require('../actions/ArtistActions');

/**
 * 歌手Store
 */
module.exports = exports = Reflux.createStore({
    listenables: [actions],

    init: function () {
        this.artist = {
            data: {},
            loaded: false
        };
    },

    /**
     * 请求数据设置默认参数
     */
    onGet: function () {
        this.artist.loaded = false;
        this.updateUI(this.artist);
    },

    /**
     * 根据id获取歌手完成事件
     * @param res
     */
    onGetCompleted: function (res) {
        this.artist.data = res.data.data;
        this.artist.loaded = true;
        this.updateUI(this.artist);
    },

    /**
     * 歌手获取出错时候调用
     */
    onGetFailed: function (error) {
        this.updateUI({
            data: {},
            loaded: true,
            error: error
        });
    },

    /**
     * 更新歌手信息
     * @param id
     * @param attributes
     */
    onUpdate: function (id, attributes) {
        this.artist.data = assign(this.artist.data || {}, attributes);
        this.updateUI({
            data: this.artist.data,
            updated: false
        });
    },

    /**
     * 更新完成
     * @param res
     */
    onUpdateCompleted: function () {
        this.updateUI({
            data: this.artist.data,
            updated: true
        });
    },

    /**
     * 更新前进行本地的赋值
     * @param artist
     */
    onCreate: function (artist) {
        this.artist.data = artist;
        this.updateUI({
            data: this.artist.data,
            created: false
        });
    },

    /**
     * 创建艺人完成后
     * @param res
     */
    onCreateCompleted: function (res) {
        this.artist.data._id = res.data._id;
        this.updateUI({
            data: this.artist.data,
            created: true
        });
    },

    /**
     * 更新出错进行处理
     * @param error
     */
    onCreateFailed: function (error) {
        this.updateUI({
            created: false,
            error: error
        });
    },

    /**
     * 更新UI界面
     * @param artist
     */
    updateUI: function (artist) {
        this.trigger(artist);
    },

    /**
     * 默认状态值
     * @returns {{}|*}
     */
    getInitialState: function () {
        return this.artist;
    },

    /**
     * 置空数据
     */
    onReset: function () {
        this.updateUI({
            data: {},
            loaded: false
        });
    }
});
