import Reflux from 'reflux'
import ChartAPIUtil from 'app/utils/ChartAPIUtils'

let ChartActions = Reflux.createActions({
    'get': {
        asyncResult: true
    }
});

ChartActions.get.listenAndPromise(ChartAPIUtil.get);

export default ChartActions

