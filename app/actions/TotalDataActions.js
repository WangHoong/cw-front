/*global Reflux*/

var TotalDataUtil = require('app/utils/TotalDataUtil');

var TotalDataActions = Reflux.createActions({
  'get': {
    asyncResult: true
  }
});

TotalDataActions.get.listenAndPromise(TotalDataUtil.get);

module.exports = TotalDataActions;
