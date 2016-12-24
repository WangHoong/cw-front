'use strict';
var React = require('react');
var Reflux = require('reflux');
var dbg = require('debug')('topdmc:SearchBox/Component/Main');

var SearchBoxActions = require('app/actions/SearchBoxActions');
var SearchBoxStore = require('app/stores/SearchBoxStore');

var Header = require('./Header.jsx');
var Result = require('./Result.jsx');

/*
 * SearchBox
 */
var SearchBox = React.createClass({

  displayName: 'SearchBoxMain',

  propTypes: {
    type: React.PropTypes.string.isRequired,
    onItemClick: React.PropTypes.func.isRequired,
    selectedItems: React.PropTypes.array.isRequired
  },

  mixins: [Reflux.connect(SearchBoxStore, "searching")],

  _buildSearchEventStream: function (inputStream, btnClickStream) {
    var self = this;
    var _searchEventStream = inputStream
        .combine(btnClickStream, function (text, click) {
          return text;
        })
        .filter(function (text) {
          return text.length >= self.props.minimalKeywordCount;
        })
        .debounce(300);

    var _searchRequsetStream = _searchEventStream
        .flatMapLatest(function (text) {
          return Kefir.fromPromise(SearchBoxActions.search(text, self.props.type));
        });

    _searchRequsetStream.onAny(function (event) {
      dbg('_searchRequsetStream.onValue', event);
    });
  },

  getInitialState: function () {
    return this.props;
  },

  getDefaultProps: function () {
    return {
      type: 'Album',
      minimalKeywordCount: 1
    };
  },

  render: function () {
    this.state.searching = this.state.searching || {
      state: 'WAIT',
      results: []
    };

    if(this.state.searching.type!==this.props.type){
      this.state.searching = {
        state: 'WAIT',
        results: []
      };
    }

    return (
        <div id="search_box topdmc">
          <Header
              type={this.props.type}
              state={this.state.searching.state}
              eventStreamBuilder={this._buildSearchEventStream}
              minimalKeywordCount={this.props.minimalKeywordCount}/>
          <Result
              data={this.state.searching.results}
              state={this.state.searching.state}
              type={this.props.type} selectedItems={this.props.selectedItems} {...this.props}/>

        </div>
    );
  }
});

exports = module.exports = SearchBox;
