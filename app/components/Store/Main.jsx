var React = require('react');
var Reflux = require('reflux');
var List = require('./List.jsx');
var ListSearch = require('./Search.jsx');
var Pager = require('../common/Pager.jsx');
var StoreStore = require('../../stores/StoreStore');
var StoreActions = require('../../actions/StoreActions');

var Loader = require('../Common/Loader.jsx');
var Main = React.createClass({

  mixins: [Reflux.connect(StoreStore, 'store')],

  contextTypes: {
    router: React.PropTypes.func
  },

  componentDidMount: function () {
    StoreActions.find();
  },

  getDefaultProps: function () {
    return {
      size: 20,
      visiblePages: 5
    };
  },

  handleSearch: function() {
    var params = {
      q: this.refs.searchBar.getValue(),
      page: 1,
      size: this.props.size
    };
    this.context.router.transitionTo('store', {}, params);
    StoreActions.find(params);
  },

  handlePageChanged: function(pageIndex) {
    var params = this.context.router.getCurrentQuery();
    params.page = pageIndex + 1;
    this.context.router.transitionTo('store', {}, params);

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
        <ListSearch handleSearch={this.handleSearch} placeholder='歌手/专辑/歌曲' ref='searchBar'/>
        {this.renderResult()}
        <Pager
          current={this.state.store.data.page || 0}
          total={this.state.store.data.totalPage || 0}
          visiblePages={this.props.visiblePages}
          titles={{
            first: '第一页',
            prev: '上一页',
            prevSet: '...',
            nextSet: '...',
            next: '下一页',
            last: '最后一页'
          }}
          onPageChanged={this.handlePageChanged} />
      </div>
    );
  }

});

module.exports = Main;
