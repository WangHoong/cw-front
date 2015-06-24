/*global Reflux*/
"use strict";

// var Reflux = require('reflux');
var ArtistAPIUtil = require('../utils/ArtistAPIUtils');

var ArtistActions = Reflux.createActions({
    'find': {
        asyncResult: true
    },
    'get': {
        asyncResult: true
    },
    'update': {
        asyncResult: true
    },
    'create': {
        asyncResult: true
    },
    'countries': {
        asyncResult: true
    },
    'search': {
        asyncResult: true
    },
    'reset': {}
});


ArtistActions.find.listenAndPromise(ArtistAPIUtil.find);
ArtistActions.update.listenAndPromise(ArtistAPIUtil.update);
ArtistActions.get.listenAndPromise(ArtistAPIUtil.get);
ArtistActions.countries.listenAndPromise(ArtistAPIUtil.countries);
ArtistActions.create.listenAndPromise(ArtistAPIUtil.create);
ArtistActions.search.listenAndPromise(ArtistAPIUtil.search);

module.exports = ArtistActions;
