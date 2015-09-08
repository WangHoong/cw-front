import Reflux from 'reflux';
import APIUtil from '../utils/AuthorizationAPIUtils';

var Actions = Reflux.createActions({
    'create': {
        asyncResult: true
    }
});

Actions.create.listenAndPromise(APIUtil.create);

// exports
module.exports = Actions;
