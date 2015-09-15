var Reflux = require('reflux');
var OrderInfoAPIUtils = require('../utils/OrderInfoAPIUtils');
var OrderInfoActions = Reflux.createActions({
  'get': {
      asyncResult: true
  },
  'update': {
      asyncResult: true
  },
});
OrderInfoActions.get.listenAndPromise(OrderInfoAPIUtils.get);
OrderInfoActions.update.listenAndPromise(OrderInfoAPIUtils.update);
module.exports = OrderInfoActions;
