var React = require('react');
var Reflux = require('reflux');
var List = require('./List.jsx');
var ListSearch = require('./Search.jsx');
var Pager = require('../common/Pager.jsx');
var StoreStore = require('../../stores/StoreStore')
var StoreActions = require('../../actions/StoreActions')
var Main = React.createClass({

  mixins: [Reflux.connect(StoreStore, 'store')],
  contextTypes: {
    router: React.PropTypes.func
  },

  componentDidMount: function () {
    StoreActions.find();
    console.log(this.state.store);
  },
  getDefaultProps: function () {
    return {
      size: 20,
      visiblePages: 5
    };
  },
  handlePageChanged: function (pageIndex) {
    var params = this.context.router.getCurrentQuery();
    params.page = pageIndex + 1;
    params.size = this.props.size;
    this.context.router.transitionTo('store', {}, params);


    StoreActions.find({
      size: this.props.size,
      page: pageIndex + 1
    });
  },

  render: function() {
    if(this.state.store.loaded){
    return (

      <div>
        <ListSearch handleSearch={this.handleSearch} placeholder='歌手/专辑/歌曲' ref='searchBar'/>
        <ul className='store-list row'>
            {this.state.store.data.items.map(function(store,i){
              return <List data={store} key={store.id} rank={i}/>
            })}
        </ul>
        <Pager
          current={this.state.store.data.page}
          total={this.state.store.data.totalPage}
          visiblePages={this.props.visiblePages}
          titles={{
            first: '第一页',
            prev: '上一页',
            prevSet: '...',
            nextSet: '...',
            next: '下一页',
            last: '最后一页'
          }}
          onPageChanged={this.handlePageChanged}/>

      </div>


      );
    }else {
      return(
        <div>
          <ListSearch handleSearch={this.handleSearch} placeholder='歌手/专辑/歌曲' ref='searchBar'/>
        </div>
      );
    }
  }

});

module.exports = Main;
// <div >
//   {this.state.store.data.map(function(store,i){
//     return <List data={store} key={store.id} rank={i}/>
//   })}
// </div>
