/*global Reflux*/
"use strict";

// var Reflux = require('reflux');
var SongAPIUtil = require('../utils/SongAPIUtils');

var SongActions = Reflux.createActions({
    'find': {
        asyncResult: true
    },
    'get': {
        asyncResult: true
    },
    'create': {
        asyncResult: true
    },
    'update': {
        asyncResult: true
    }
});

SongActions.find.listenAndPromise(SongAPIUtil.find);
SongActions.get.listenAndPromise(SongAPIUtil.get);
SongActions.create.listenAndPromise(SongAPIUtil.create);
SongActions.update.listenAndPromise(SongAPIUtil.update);

module.exports = SongActions;
