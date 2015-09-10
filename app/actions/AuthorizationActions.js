import Reflux from 'reflux';
import APIUtil from '../utils/AuthorizationAPIUtils';

var Actions = Reflux.createActions({
  'create': {
    asyncResult: true
  },
  'get': {
    asyncResult: true
  }
});

Actions.create.listenAndPromise(APIUtil.create);
Actions.get.listenAndPromise(APIUtil.get);

// exports
module.exports = Actions;
