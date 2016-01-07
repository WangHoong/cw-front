var React = require('react');
var Reflux = require('reflux');
var List = require('./List.jsx');
var ListSearch = require('./Search.jsx');
var Pager = require('../Common/Pager.jsx');
var StoreStore = require('../../stores/StoreStore');
var StoreActions = require('../../actions/StoreActions');

var Loader = require('../Common/Loader.jsx');
var Main = React.createClass({

  mixins: [Reflux.connect(StoreStore, 'store')],

  contextTypes: {
    location: React.PropTypes.object,
    history: React.PropTypes.object,
  },

  componentDidMount: function () {
    StoreActions.find();
  },

  getDefaultProps: function () {
    return {
      size: 20,
      visiblePages: 5,
    };
  },

  handleSearch: function() {
    var params = {
      q: this._searchBar.value,
      page: 1,
      size: this.props.size,
    };
    this.context.history.pushState(null,'store', params);
    StoreActions.find(params);
  },

  handlePageChanged: function(pageIndex) {
    var params = this.context.location.query;
    params.page = pageIndex + 1;
    this.context.history.pushState(null,'store', params);

    StoreActions.find(params);
  },

  renderResult: function() {
    if (!this.state.store.loaded) {
      return <Loader />;
    }
    var __items = this.state.store.data.items.map(function(store, i) {
      return <List data={store} key={store.id} rank={i} />
    });
    return <ul className='store-list row'>{__items}</ul>;
  },

  render: function() {
    return (
      <div>
        <ListSearch handleSearch={this.handleSearch} placeholder='歌手/专辑/歌曲' ref={ _ => this._searchBar = _}/>
        {this.renderResult()}
        <Pager
          current={this.state.store.data.page || 0}
          total={this.state.store.data.totalPage || 0}
          visiblePages={this.props.visiblePages}
          titles={{
            first: window.lang.tfp,
            prev: window.lang.pp,
            prevSet: '...',
            nextSet: '...',
            next: window.lang.np,
            last: window.lang.tlp
          }}
          onPageChanged={this.handlePageChanged} />
      </div>
    );
  }

});

module.exports = Main;
