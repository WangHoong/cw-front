"use strict";
var Reflux = require('reflux');
var SettlementAPIUtils = require('../utils/SettlementAPIUtils');

var StoreActions = Reflux.createActions({
  'find': {
    asyncResult: true
  }
});
StoreActions.find.listenAndPromise(SettlementAPIUtils.find);
module.exports = StoreActions;
