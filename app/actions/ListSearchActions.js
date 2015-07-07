"use strict";
var Reflux = require('reflux');
var SearchListAPIUtils = require('../utils/ListSearchAPIUtils');

var SearchListActions = Reflux.createActions({

  'search': {
    asyncResult: true
  },

  'toggledShow': {},
  'clear': {}

});

SearchListActions.search.listenAndPromise(SearchListAPIUtils.search);

module.exports = SearchListActions;
