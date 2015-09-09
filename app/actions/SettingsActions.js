var Reflux = require('reflux');
var SettingsAPIUtils = require('../utils/SettingsAPIUtils');
var SettingsActions = Reflux.createActions({
  'find': {
      asyncResult: true
  },
  'get': {
      asyncResult: true
  }
});
SettingsActions.find.listenAndPromise(SettingsAPIUtils.find);
SettingsActions.get.listenAndPromise(SettingsAPIUtils.get);
module.exports = SettingsActions;
