var React = require('react');
var Reflux = require('reflux');
var AlbumList = require('../Albums/List.jsx');
var AlbumListStore = require('../../stores/AlbumListStore');
var AlbumActions = require('../../actions/AlbumActions');
var Pager = require('../Common/Pager.jsx');

module.exports = exports = React.createClass({

  mixins: [Reflux.connect(AlbumListStore, 'albums')],

  contextTypes: {
    history: React.PropTypes.object,
  },

  handleShowDetailAction: function (evt) {
    evt.preventDefault();
    var id = evt.target.getAttribute('data-id');
    this.context.history.pushState(null, `/albums/${id}`, {});
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
            first: window.lang.tfp,
            prev: window.lang.pp,
            prevSet: '...',
            nextSet: '...',
            next: window.lang.np,
            last: window.lang.tlp}}
          total={this.state.albums.totalPage}
          visiblePages={this.props.visiblePages}></Pager>
      </div>
    );
  }
});
