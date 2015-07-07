var Reflux = require('reflux');
var assign = require('object-assign');
var actions = require('../actions/SongActions');

/**
 * 歌手Store
 */
module.exports = exports = Reflux.createStore({
    listenables: [actions],

    init: function () {
        this.song = {
            data: {},
            loaded: false
        };
    },

    /**
     * 请求数据设置默认参数
     */
    onGet: function () {
        this.song.loaded = false;
        this.updateUI(this.song);
    },

    /**
     * 根据id获取歌手完成事件
     * @param res
     */
    onGetCompleted: function (res) {
        this.song.data = res.data.data;
        this.song.loaded = true;
        this.updateUI(this.song);
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
        this.song.data = assign(this.song.data || {}, attributes);
        this.updateUI({
            data: this.song.data,
            updated: false
        });
    },

    /**
     * 更新完成
     * @param res
     */
    onUpdateCompleted: function () {
        this.updateUI({
            data: this.song.data,
            updated: true
        });
    },

    /**
     * 更新前进行本地的赋值
     * @param artist
     */
    onCreate: function (artist) {
        this.song.data = artist;
        this.updateUI({
            data: this.song.data,
            created: false
        });
    },

    /**
     * 创建歌曲完成后
     * @param res
     */
    onCreateCompleted: function (res) {
        this.song.data.id = res.data.data.id;
        this.updateUI({
            data: this.song.data,
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
        return this.song;
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
