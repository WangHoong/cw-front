"use strict";
var Reflux = require('reflux');
var StoreAPIUtils = require('../utils/StoreAPIUtils');

var StoreActions = Reflux.createActions({
  'find': {
    asyncResult: true
  }
});

StoreActions.find.listenAndPromise(StoreAPIUtils.find);

module.exports = StoreActions;
