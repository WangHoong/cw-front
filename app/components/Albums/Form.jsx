'use strict';
var React = require('react');
var UpAvatar = require('../Common/UpAvatar.jsx');
var Assist = require('../Common/Assist.jsx');
var dbg = require('debug')('topdmc:album/Form');
var SongMiniCard = require('../Songs/MiniCard.jsx');
var ArtistMiniCard = require('../Artists/MiniCard.jsx');

var TextareaAutosize = require('../Common/TextareaAutosize.jsx');

var AddCardTips = require('../Common/AddCardTips.jsx');
var assign = require('object-assign');
var classNames = require('classnames');
var _ = require('lodash');
var Dialog = require('rc-dialog');
var List = require('./Dsps/List.jsx');
var Form = React.createClass({

  getInitialState: function () {
    var defaultState = assign({
      isDropSongActive: false,
      isDropArtistActive: false,
      SearchBoxType: 'Artist',
      lrc: '',
      visible: false,
      destroyOnClose: false,
    }, this.props.data);
    return defaultState;
  },

  componentDidMount: function() {
    this.isDropArtistActiveState = false;
    this.isDropSongActiveState = false;
  },
  // 弹窗相关事件处理
  onClick(e) {
    this.setState({
      mousePosition: {
        x: e.pageX,
        y: e.pageY,
      },
      visible: true,
    });
  },

  onClose() {
    this.state.visible=false;
    this.setState(this.state)
  },

  componentWillReceiveProps: function (nextProps) {
    this.setState(nextProps.data);
  },

  // 拖拽相关事件处理
  // --------------------------------------------
  handleDrop: function(evt) {
    evt.preventDefault();
    var card;
    try {
      card = JSON.parse(evt.dataTransfer.getData('data'));
    } catch(e) {
      return;
    }
    this.handleItemClick(card);
    var type = card.type;
    if (type === 'Artist') {
      this.isDropArtistActiveState = false;
      this.state.isDropArtistActive = false;
      this.setState(this.state);
    }

    if (type === 'Song') {
      this.isDropSongActiveState = false;
      this.state.isDropSongActive = false;
      this.setState(this.state);
    }
  },

  allowArtistDrop: function(evt) {
    evt.preventDefault();
    this.state.isDropArtistActive = true;
    if (this.isDropArtistActiveState) return;
    this.setState(this.state);
    this.isDropArtistActiveState = true;
  },

  allowSongDrop: function(evt) {
    evt.preventDefault();
    this.state.isDropSongActive = true;
    if (this.isDropSongActiveState) return;
    this.setState(this.state);
    this.isDropSongActiveState = true;
  },

  handleDragArtistEnter: function(evt) {
    evt.preventDefault();
    this.state.isDropArtistActive = true;
    this.setState(this.state);
  },

  handleDragSongEnter: function(evt) {
    evt.preventDefault();
    this.state.isDropSongActive = true;
    this.setState(this.state);
  },

  handleDragArtistLeave: function(evt) {
    evt.preventDefault();
    this.isDropArtistActiveState = false;
    this.state.isDropArtistActive = false;
    this.setState(this.state);
  },

  handleDragSongLeave: function(evt) {
    evt.preventDefault();
    this.isDropSongActiveState = false;
    this.state.isDropSongActive = false;
    this.setState(this.state);
  },

  IsAdded: function (items, id) {
    return _.findIndex(items, {id: id}) !== -1;
  },

  handleItemClick: function(card) {
    if (card.type === 'Song') {
      if (this.IsAdded(this.state.tracks, card.data.id)) {
        return;
      }

      this.state.tracks = this.state.tracks || [];
      this.state.tracks.push(card.data);
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

  handleChange: function (evt) {
    this.state[evt.target.name] = evt.target.value;
    this.setState(this.state);
  },

  handlePhotoUploaded: function() {
    var photo = this.refs.photo.getValue();
    this.state['photo'] = photo.src;
    this.state['resource_id'] = photo.resource_id;
    this.setState(this.state);
  },

  getValue: function() {
    delete this.state.isDropSongActive;
    delete this.state.isDropArtistActive;
    delete this.state.SearchBoxType;
    delete this.state.visible;
    if(this.refs.form) {
      this.state.publish_info = JSON.stringify(this.refs.form.getValue());
    };
    return this.state;
  },

  changeSearchBoxType: function(type) {
    this.state.SearchBoxType = type;
    this.setState(this.state);
  },

  handleRemoveSong: function(evt, data) {
    var id = data.id;
    if (!id) return;

    this.state.tracks = _.filter(this.state.tracks, function (item) {
      return item.id !== id;
    });

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

  renderSongMiniCards: function() {
    this.state.tracks = this.state.tracks || [];
    if (this.state.tracks.length === 0) {
      return (
        <ul className='row'>
          <AddCardTips
            data-type='Song'
            onClick={this.changeSearchBoxType.bind(null, 'Song')}
            iconClassName='music'
            title={window.lang.al_addtr} />
        </ul>
      );
    } else {
      var self = this;
      var items = this.state.tracks.map(function(item) {
        item.photo = self.state.photo || '';
        return (
          <SongMiniCard
            data={item}
            key={item.id}
            onRemove={self.handleRemoveSong} />
        );
      });
      return (
        <ul className='row'>
          {items}
          <AddCardTips
            data-type='Song'
            onClick={this.changeSearchBoxType.bind(null, 'Song')}
            iconClassName='music'
            title={window.lang.al_addtr} />
        </ul>
      );
    }
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
            title={window.lang.al_addar} />
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
            title={window.lang.al_addar} />
        </ul>
      );
    }
  },

  render: function() {
    var data = this.state;
    var SearchBoxType = this.state.SearchBoxType;
    var selectedItems = [];
    if (SearchBoxType === 'Artist') {
      selectedItems = this.state.artists;
    }
    if (SearchBoxType === 'Song') {
      selectedItems = this.state.tracks;
    }
    var dropSongClassName = classNames('card', 'mt20', 'card-dropzone', {
      'active': this.state.isDropSongActive
    });
    var dropArtistClassName = classNames('card', 'mt20', 'card-dropzone', {
      'active': this.state.isDropArtistActive
    });
    let dialog;
    if (this.state.visible) {
      dialog = (
        <Dialog
          visible={this.state.visible}
          animation="slide-fade"
          maskAnimation="fade"
          onClose={this.onClose}
          style={{ width: 600, backgroundColor: '#ccc',zIndex:9,overflow: 'hidden'}}
          title={<div style={{textAlign: 'center', overflow: 'hidden'}}>发行设置<button
            type="button"
            className="btn btn-default"
            key="close"
            onClick={this.onClose}
            style={{float: 'right'}}
          >
          X
          </button></div>}
          mousePosition={this.state.mousePosition}
          footer={
            [
              <List publish_info={this.props.data.publish_info} ref='form' style={{overflow: 'hidden'}} />,
                <div style={{float:'left'}}>
                  <button type="button" className="btn btn-default">取消</button>
                  <button type="button" className="btn btn-default" onClick={this.onClose}>确认</button>
                  <div style={{height: 200}}></div>
                </div>
            ]
          }
        >
        </Dialog>
      );
    }
    var hasPower = window.__HASPOWER__
    return (
      <div className='show-wrap'>
        <div className='edit-wrap has-assist-box'>
          <div className='edit-form card clearfix'>

            <div className='edit-left'>
              <UpAvatar
                src={data.photo}
                ref='photo'
                type='album_photo'
                uploadComplete={this.handlePhotoUploaded}/>
            </div>

            <div className='edit-right'>
              <div className='form-group'>
                <p className='form-control-static'>{window.lang.al_name}</p>
                <input
                  name='name'
                  type='text'
                  className='form-control'
                  value={data.name}
                  onChange={this.handleChange} />
              </div>
              <div className='form-group'>
                <p className='form-control-static'>{window.lang.al_intro}</p>
                <TextareaAutosize
                  name='desc'
                  className='form-control'
                  value={data.desc}
                  onChange={this.handleChange}/>
              </div>
            </div>

          </div>


          <div
            className={dropArtistClassName}
            onDrop={this.handleDrop}
            onDragOver={this.allowArtistDrop}
            onDragEnter={this.handleDragArtistEnter}
            onDragLeave={this.handleDragArtistLeave}>
            <p className='form-control-static'>{window.lang.al_artist}</p>
            {this.renderArtistMiniCards()}
            { hasPower
              ? <div className='text-right mt20'>
                  {this.props.children}
                </div>
              : null
            }
          </div>

          { hasPower
            ? null
            : <div
                className={dropSongClassName}
                onDrop={this.handleDrop}
                onDragOver={this.allowSongDrop}
                onDragEnter={this.handleDragSongEnter}
                onDragLeave={this.handleDragSongLeave}>
                <p className='form-control-static'>{window.lang.al_track}</p>
                {this.renderSongMiniCards()}
                <div className='text-right mt20'>
                  {this.props.children}
                </div>
              </div>
          }


          <div className='card mt20'>
            <div>发行设置:
              <a>默认发行平台</a>
              <button type="button" className="btn btn-default" onClick={this.onClick}>高级选项</button>
            </div>
          </div>

        </div>
        {dialog}
        <Assist
          type={SearchBoxType}
          selectedItems={selectedItems || []}
          onItemClick={this.handleItemClick} />
      </div>
    );
  }

});

module.exports = Form;
