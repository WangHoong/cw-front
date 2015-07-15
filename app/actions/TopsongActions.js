var Reflux = require('reflux');
var TopsongAPIUtil = require('../utils/TopsongAPIUtils');
var TopsongActions = Reflux.createActions({
  'find': {
      asyncResult: true
  },
});
TopsongActions.find.listenAndPromise(TopsongAPIUtil.find);
module.exports = TopsongActions;
