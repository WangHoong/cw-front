var React = require('react');
var Reflux = require('reflux');
var AlbumList = require('./List.jsx');
var AlbumListStore = require('../../stores/AlbumListStore');
var AlbumActions = require('../../actions/AlbumActions');

var Pager = require('../Common/Pager.jsx');
var Role = require('../Common/Role.jsx');

var ListSearch = require('../ListSearch/Main.jsx');

var Main = React.createClass({

  mixins: [Reflux.connect(AlbumListStore, 'album')],

  contextTypes: {
      router: React.PropTypes.func
  },

  handleShowDetailAction: function(evt) {
    evt.preventDefault();
    var id = evt.target.getAttribute('data-id');
    this.context.router.transitionTo('show_edit_album', {id: id}, {});
  },

  getDefaultProps: function() {
    return {
      visiblePages: 5,
      size: 20
    };
  },

  componentDidMount: function () {
    var params = this.context.router.getCurrentQuery();
    params.size = this.props.size;
    AlbumActions.find(params);

  },

  renderList: function(pageIndex) {
    var params = this.context.router.getCurrentQuery();
    params.page = pageIndex + 1;
    params.size = this.props.size;
    this.context.router.transitionTo('albums', {}, params);
    AlbumActions.find(params);

  },

  handleKeywordsSearch: function(keywords) {
    var params = {
      q: keywords,
      page: 1,
      size: this.props.size
    };
    this.context.router.transitionTo('albums', {}, params);
    AlbumActions.find(params);
  },

  handleItemSearch: function(id, name) {
    var params = {
      artist_id: id,
      page: 1,
      size: this.props.size
    };
    console.log(params);
    this.context.router.transitionTo('albums', {}, params);
    AlbumActions.find(params);
  },

  handleRedirectNew: function() {
    this.context.router.transitionTo('new_album', {}, {});
  },

  render: function() {
    return (
      <div className='list-wrap'>
        <ListSearch
          placeholderPattern='${name}的所有专辑'
          handleKeywordsSearch={this.handleKeywordsSearch}
          handleItemSearch={this.handleItemSearch}
          type='Album' />
        <div className='has-top-bar'>
          <div className='btn-group'>
            <Role component='button' roleName='ADMIN' onClick={this.handleRedirectNew} className="btn btn-default">{window.lang.add_al}</Role>
          </div>
          <AlbumList
            items={this.state.album.items}
            onShowDetailAction={this.handleShowDetailAction}
            loaded={this.state.album.loaded} />
          <Pager
            current={this.state.album.page}
            total={this.state.album.totalPage}
            visiblePages={this.props.visiblePages}
            onPageChanged={this.renderList}
            titles={{
              first: window.lang.tfp,
              prev: window.lang.pp,
              prevSet: '...',
              nextSet: '...',
              next: window.lang.np,
              last: window.lang.tlp}}></Pager>
        </div>
      </div>
    );
  }

});

module.exports = Main;
