"use strict";
var Reflux = require('reflux');
var actions = require('../actions/SongActions');

var SongCreateStore = Reflux.createStore({
    listenables: [actions],

    init: function () {
        this.song = {};
    },
    getInitialState: function () {
        return this.song;
    },
    onGetCompleted: function (res) {
        this.updateUI(res.data);
    },
    updateUI: function (song) {
        this.song = song;
        this.trigger(this.song);
    }
});

module.exports = SongCreateStore;
