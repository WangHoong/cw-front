'use strict';
var React = require('react');
var Assist = require('../Common/Assist.jsx');
var dbg = require('debug')('topdmc:Song/Form');
var ArtistMiniCard = require('../Artists/MiniCard.jsx');
var AlbumMiniCard = require('../Albums/MiniCard.jsx');

var AddCardTips = require('../Common/AddCardTips.jsx');
var assign = require('object-assign');
var classNames = require('classnames');
var _ = require('lodash');
var APIHelper = require('app/utils/APIHelper').APIHelper;
var axios = require('axios');

var Role = require('app/components/Common/Role.jsx');

var TextareaAutosize = require('../Common/TextareaAutosize.jsx');

var Mp3Uploader = require('app/components/Common/Mp3Uploader.jsx');

var Form = React.createClass({

  getInitialState: function() {
    var defaultState = assign({
      isDropArtistActive: false,
      isDropAlbumActive: false,
      SearchBoxType: 'Artist',
      lrc: ''
    }, this.props.data);
    return defaultState;
  },

  componentDidMount: function() {
    this.isDropArtistActiveState = false;
    this.isDropAlbumActiveState = false;
  },

  componentWillReceiveProps: function(nextProps) {
    this.setState(nextProps.data);
  },

  // 拖拽相关事件处理
  // --------------------------------------------
  handleDrop: function(evt) {
    evt.preventDefault();

    var card;

    try {
      card = JSON.parse(evt.dataTransfer.getData('data'));
    } catch (e) {
      return;
    }

    this.handleItemClick(card);
    var type = card.type;
    if (type === 'Album') {
      this.isDropAlbumActiveState = false;
      this.state.isDropAlbumActive = false;
      this.setState(this.state);
    }
    if (type === 'Artist') {
      this.isDropArtistActiveState = false;
      this.state.isDropArtistActive = false;
      this.setState(this.state);
    }
  },

  allowAlbumDrop: function(evt) {
    evt.preventDefault();
    this.state.isDropAlbumActive = true;
    if (this.isDropAlbumActiveState) return;
    this.setState(this.state);
    this.isDropAlbumActiveState = true;
  },

  allowArtistDrop: function(evt) {
    evt.preventDefault();
    this.state.isDropArtistActive = true;
    if (this.isDropArtistActiveState) return;
    this.setState(this.state);
    this.isDropArtistActiveState = true;
  },

  handleDragAlbumEnter: function(evt) {
    evt.preventDefault();
    this.state.isDropAlbumActive = true;
    this.setState(this.state);
  },

  handleDragArtistEnter: function(evt) {
    evt.preventDefault();
    this.state.isDropArtistActive = true;
    this.setState(this.state);
  },

  handleDragAlbumLeave: function(evt) {
    evt.preventDefault();
    this.isDropAlbumActiveState = false;
    this.state.isDropAlbumActive = false;
    this.setState(this.state);
  },

  handleDragArtistLeave: function(evt) {
    evt.preventDefault();
    this.isDropArtistActiveState = false;
    this.state.isDropArtistActive = false;
    this.setState(this.state);
  },

  getValue: function () {
    delete this.state.isDropArtistActive;
    delete this.state.isDropAlbumActive;
    delete this.state.SearchBoxType;
    this.state.lrc = this.state.lrc.split('\n').join('\\n');
    return this.state;
  },

  IsAdded: function(items, id) {
    return _.findIndex(items, {id: id}) !== -1;
  },

  handleItemClick: function(card) {
    if (card.type === 'Album') {
      this.state.album = card.data;
      this.setState(this.state);
    }

    if (card.type === 'Artist') {
      if (this.IsAdded(this.state.artists, card.data.id)) {
        return;
      }

      this.state.artists = this.state.artists || [];
      this.state.artists.push(card.data);
      this.setState(this.state);
    }
  },

  handleChange: function(evt) {
    this.state[evt.target.name] = evt.target.value;
    this.setState(this.state);
  },

  handleRemoveArtist: function(evt, data) {
    var id = data.id;
    if (!id) return;

    this.state.artists = _.filter(this.state.artists, function (item) {
      return item.id !== id;
    });

    this.setState(this.state);
  },

  handleRemoveAlbum: function(evt, data) {
    evt.preventDefault();
    this.state.album = {};
    this.setState(this.state);
  },

  changeSearchBoxType: function(type) {
    this.state.SearchBoxType = type;
    this.setState(this.state);
  },

  renderArtistMiniCards: function() {
    this.state.artists = this.state.artists || [];
    if (this.state.artists.length === 0) {
      return (
        <ul className='row'>
          <AddCardTips
            data-type='Artist'
            onClick={this.changeSearchBoxType.bind(null, 'Artist')}
            iconClassName='user'
            title='添加歌手' />
        </ul>
      );
    } else {
      var self = this;
      var items = this.state.artists.map(function(item) {
        return (
          <ArtistMiniCard
            data={item}
            key={item.id}
            onRemove={self.handleRemoveArtist} />
        );
      });
      return (
        <ul className='row'>
          {items}
          <AddCardTips
            data-type='Artist'
            onClick={this.changeSearchBoxType.bind(null, 'Artist')}
            iconClassName='user'
            title='添加歌手' />
        </ul>
      );
    }
  },

  renderAlbumMiniCards: function() {
    var album = this.state.album || {};
    if (!album.id) {
      return (
        <ul className='row'>
          <AddCardTips
            data-type='Album'
            onClick={this.changeSearchBoxType.bind(null, 'Album')}
            iconClassName='edit'
            title='添加专辑' />
        </ul>
      );
    } else {
      return (
        <ul className="row">
          <AlbumMiniCard data={album} key={album.id} onRemove={this.handleRemoveAlbum} />
        </ul>
      );
    }
  },

  upload128Complete: function(data) {
    if (data.Filedata.fullpath) {
      this.state.play_url_128 = data.Filedata.fullpath;
    }
  },

  upload320Complete: function(data) {
    if (data.Filedata.fullpath) {
      this.state.play_url_320 = data.Filedata.fullpath;
    }
  },

  renderUpload: function() {
    let data = this.state;
    return (
      <Role component='div' className='card mt20' roleName='ADMIN'>
        <p className='form-control-static'>上传歌曲</p>
        <div className='row'>
          <div className='col-sm-6'>
            <Mp3Uploader tips='点击上传128K' uploadComplete={this.upload128Complete} />
          </div>
          <div className='col-sm-6'>
            <Mp3Uploader tips='点击上传320K' uploadComplete={this.upload320Complete} />
          </div>
        </div>
      </Role>
    );
  },

  render: function() {
    var data = this.state;
    var SearchBoxType = this.state.SearchBoxType;
    var selectedItems = [];
    if (SearchBoxType === 'Artist') {
      selectedItems = this.state.artists;
    }
    if (SearchBoxType === 'Album') {
      selectedItems = [this.state.album];
    }
    var dropAlbumClassName = classNames('card', 'mt20', 'card-dropzone', {
      'active': this.state.isDropAlbumActive
    });
    var dropArtistClassName = classNames('card', 'mt20', 'card-dropzone', {
      'active': this.state.isDropArtistActive
    });
    return (
      <div className='show-wrap'>
        <div className='edit-wrap has-assist-box'>

          <div className='edit-form card'>
            <div className='form-group'>
              <p className='form-control-static'>歌曲名称</p>
              <input
                name='name'
                type='text'
                className='form-control'
                value={data.name}
                onChange={this.handleChange}/>
            </div>
            <div className='form-group'>
              <p className='form-control-static'>作词</p>
              <input
                name='lyricist'
                className='form-control'
                value={data.lyricist}
                onChange={this.handleChange}/>
            </div>
            <div className='form-group'>
              <p className='form-control-static'>作曲</p>
              <input
                name='composer'
                className='form-control'
                value={data.composer}
                onChange={this.handleChange}/>
            </div>
            <div className='form-group'>
              <p className='form-control-static'>歌词</p>
              <TextareaAutosize
                name='lrc'
                className='form-control'
                onChange={this.handleChange}
                value={(data.lrc || '').split('\\n').join('\n')}></TextareaAutosize>
            </div>
          </div>

          <div
            className={dropArtistClassName}
            onDrop={this.handleDrop}
            onDragOver={this.allowArtistDrop}
            onDragEnter={this.handleDragArtistEnter}
            onDragLeave={this.handleDragArtistLeave}>
            <p className='form-control-static'>歌手</p>
            {this.renderArtistMiniCards()}
          </div>

          <div
            className={dropAlbumClassName}
            onDrop={this.handleDrop}
            onDragOver={this.allowAlbumDrop}
            onDragEnter={this.handleDragAlbumEnter}
            onDragLeave={this.handleDragAlbumLeave}>
            <p className='form-control-static'>专辑</p>
            {this.renderAlbumMiniCards()}
            <div className='text-right'>
              {this.props.children}
            </div>
          </div>

          {this.renderUpload()}

        </div>
        <Assist type={SearchBoxType} selectedItems={selectedItems} onItemClick={this.handleItemClick} />
      </div>
    );
  }

});

module.exports = Form;
