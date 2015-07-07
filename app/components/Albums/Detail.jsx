'use strict';
var React = require('react');
var Reflux = require('reflux');
var AlbumStore = require('../../stores/AlbumStore');
var AlbumActions = require('../../actions/AlbumActions');
var _ = require('lodash');

var SongChart = require('../Common/Charts/SongChart.jsx');
var SongChannelChart = require('../Common/Charts/SongChannelChart.jsx');

var Loader = require('../Common/Loader.jsx');

var Detail = React.createClass({

  mixins: [Reflux.connect(AlbumStore, 'album')],

  contextTypes: {
    router: React.PropTypes.func
  },

  componentDidMount: function () {
    AlbumActions.get(this.props.id);
  },

  filter: function(str) {
    if (str == null || str == undefined || str == '') {
      return '暂无信息';
    } else {
      return str;
    }
  },

  handleSongsClick: function(evt) {
    var id = evt.target.getAttribute('data-id');
    this.context.router.transitionTo('show_edit_song', {id: id}, {});
  },

  renderList: function() {
    var data = this.state.album.data.tracks || [];
    if (data.length == 0) {
      return (
        <li style={{width: 'auto', textAlign: 'center', float: 'none'}}>暂无歌曲信息</li>
      );
    } else {
      return data.map(function(item, idx) {
        return (
          <li key={idx} className='col-sm-4 ellipsis'>
            <span className='name'>{idx + 1}</span>
            <span><a data-id={item.id} onClick={this.handleSongsClick}>{item.name}</a></span>
          </li>
        );
      }.bind(this));
    }
  },

  handleBack: function() {
    history.go(-1);
  },

  render: function() {
    if (!this.state.album.loaded) {
      return <Loader />;
    }
    var data = this.state.album.data;
    var photoStyles = {
      backgroundImage: 'url(' + data.photo + ')'
    };
    return (
      <div className='show-wrap'>
        <div className='show-top'>
          <div className='photo pull-left' style={photoStyles}></div>
          <div className='ctrl-btn pull-right'>
            <button
              className='btn btn-warning mr10'
              onClick={this.props.handleToEdit}>编辑</button>
            <button
              className='btn btn-default'
              onClick={this.handleBack}>返回</button>
          </div>
          <div className='info'>
            <p>{this.filter(data.name)} - {_.collect(data.artists,'name').join(',')}</p>
          </div>
        </div>
        <div className='has-top-bar'>
          <div className='card'>
            <SongChart />
          </div>
          <div className='card mt20'>
            <SongChannelChart />
          </div>

          <div className='card mt20'>
            <h4>简介：</h4>
            <p>{this.filter(data.desc)}</p>
          </div>
          <div className='card mt20'>
            <ul className='row show-song-list'>
              {this.renderList()}
            </ul>
          </div>
        </div>
      </div>
    );
  }

});

module.exports = Detail;
