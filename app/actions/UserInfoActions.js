var Reflux = require('reflux');
var UserInfoAPIUtil = require('../utils/UserInfoAPIUtils');

var UserInfoActions = Reflux.createActions({
  'get': {
    asyncResult: true
  },
  'update': {
    asyncResult: true
  }
});

UserInfoActions.get.listenAndPromise(UserInfoAPIUtil.get);
UserInfoActions.update.listenAndPromise(UserInfoAPIUtil.update);

// exports
module.exports = UserInfoActions;
