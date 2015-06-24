/* global Reflux */
'use strict';

var SearchAPIUtil = require('app/utils/SearchAPIUtil');

var SearchBoxActions = Reflux.createActions({
  'search': {
    asyncResult: true
  },
  'added': {},//已经进行添加通知SearchBox
  'removed': {}, // 已经进行移除通知 SearchBox
  'push': {} // 添加一条新项
});

SearchBoxActions.search.listenAndPromise(SearchAPIUtil.search);

exports = module.exports = SearchBoxActions;
