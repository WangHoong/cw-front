// var React = require('react');
// var Reflux = require('reflux');

var AlbumList = require('../Albums/List.jsx');
var AlbumListStore = require('../../stores/AlbumListStore');
var AlbumActions = require('../../actions/AlbumActions');
var Pager = require('../Common/Pager.jsx');

module.exports = exports = React.createClass({

  mixins: [Reflux.connect(AlbumListStore, 'albums')],

  contextTypes: {
    router: React.PropTypes.func
  },

  handleShowDetailAction: function (evt) {
    evt.preventDefault();
    var id = evt.target.getAttribute('data-id');
    this.context.router.transitionTo('show_edit_album', {
      id: id
    }, {});
  },

  getDefaultProps: function () {
    return {
      visiblePages: 5,
      size: 25
    };
  },

  componentDidMount: function () {
    var params = {
      artist_id: this.props.artist_id,
      size: this.props.size
    };
    AlbumActions.find(params);
  },

  renderList: function (pageIndex) {
    var params = {
      page: pageIndex + 1,
      size: this.props.size,
      artist_id: this.props.artist_id
    };

    AlbumActions.find(params);
  },

  render: function () {

    if (this.state.albums.items.length === 0) {
      return <div/>
    }
    return (
      <div>
        <AlbumList items={this.state.albums.items} loaded={this.state.albums.loaded} onShowDetailAction={this.handleShowDetailAction}/>
        <Pager
          current={this.state.albums.page}
          onPageChanged={this.renderList}
          titles={{
            first: '第一页',
            prev: '上一页',
            prevSet: '...',
            nextSet: '...',
            next: '下一页',
            last: '最后一页'}}
          total={this.state.albums.totalPage}
          visiblePages={this.props.visiblePages}></Pager>
      </div>
    );
  }
});
