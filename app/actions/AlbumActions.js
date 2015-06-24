/*global Reflux*/

var AlbumAPIUtil = require('../utils/AlbumAPIUtils');

var AlbumActions = Reflux.createActions({
    'find': {
        asyncResult: true
    },
    'get': {
        asyncResult: true
    },
    'update': {
        asyncResult: true
    },
    'search': {
        asyncResult: true
    },
    'gettracks': {
        asyncResult: true
    },
    'create': {
        asyncResult: true
    },
    'build': {
        asyncResult: true
    }
});

AlbumActions.find.listenAndPromise(AlbumAPIUtil.find);
AlbumActions.update.listenAndPromise(AlbumAPIUtil.update);
AlbumActions.get.listenAndPromise(AlbumAPIUtil.get);
AlbumActions.create.listenAndPromise(AlbumAPIUtil.create);
AlbumActions.build.listenAndPromise(AlbumAPIUtil.build);


// exports
module.exports = AlbumActions;
