"use strict";
var React = require('react');
var Reflux = require('reflux');
var SongList = require('./List.jsx');
var SongStore = require('../../stores/SongListStore');
var SongActions = require('../../actions/SongActions');
var Pager = require('../Common/Pager.jsx');
var ListSearch = require('../ListSearch/Main.jsx');
let dbg = require('debug')('topdmc:Songs/new');
var Role = require('../Common/Role.jsx');


var Main = React.createClass({
  mixins: [Reflux.connect(SongStore, 'tracks')],

  contextTypes: {
    history: React.PropTypes.object,
    location: React.PropTypes.object,
  },

  componentDidMount: function () {
    var params = this.context.location.query;
    params.size = this.props.size;
    SongActions.find(params);
  },

  getDefaultProps: function () {
    return {
      size: 20,
      visiblePages: 5
    };
  },

  handlePageChanged: function (pageIndex) {
    var params = this.context.location.query;
    params.page = pageIndex + 1;
    params.size = this.props.size;
    this.context.history.pushState(null, '/songs', params);

    SongActions.find({
      size: this.props.size,
      page: pageIndex + 1
    });
  },

  handleShowDetailAction: function (e) {
    var id = e.target.getAttribute('data-id');
    this.context.history.pushState(null, `/songs/${id}`, {});
  },
  handleCreate: function () {
    //debug(`new song`);
    this.context.history.pushState(null, '/songs/new', {});
  },
  handleKeywordsSearch: function (keywords) {
    var params = {
      q: keywords,
      page: 1,
      size: this.props.size
    };

    this.context.history.pushState(null, '/songs', params);
    SongActions.find(params);
  },

  handleItemSearch: function(id) {
    var params = {
      artist_id: id,
      page: 1,
      size: this.props.size
    };

    this.context.history.pushState(null, '/songs', params);
    SongActions.find(params);
  },

  render: function () {

    return (
        <div className='list-wrap'>
          <ListSearch
            placeholderPattern='${name}的所有歌曲'
            handleKeywordsSearch={this.handleKeywordsSearch}
            handleItemSearch={this.handleItemSearch}
            type='Song' />
          <div className='has-top-bar'>
            <div className='btn-group'>
               <Role component='button' roleName='ADMIN' onClick={this.handleCreate} className="btn btn-default">{window.lang.add_tr}</Role>
            </div>
            <SongList
              items={this.state.tracks.items}
              loaded={this.state.tracks.loaded}
              onShowDetailAction={this.handleShowDetailAction}/>

            <Pager
              current={this.state.tracks.page}
              total={this.state.tracks.totalPage}
              visiblePages={this.props.visiblePages}
              titles={{
                first: window.lang.tfp,
                prev: window.lang.pp,
                prevSet: '...',
                nextSet: '...',
                next: window.lang.np,
                last: window.lang.tlp
              }}
              onPageChanged={this.handlePageChanged}/>
          </div>
        </div>
    );
  }
});

module.exports = Main;
