var Reflux = require('reflux');
var TopsingerAPIUtil = require('../utils/TopsingerAPIUtils');
var TopsingerActions = Reflux.createActions({
  'find': {
      asyncResult: true
  },
});
TopsingerActions.find.listenAndPromise(TopsingerAPIUtil.find);
module.exports = TopsingerActions;
