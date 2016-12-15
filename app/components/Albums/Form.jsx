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
var mydata = require('./Dsps/DefaultData.jsx');
var Form = React.createClass({

  getInitialState: function () {
    var defaultState = assign({
      isDropSongActive: false,
      isDropArtistActive: false,
      SearchBoxType: 'Artist',
      lrc: '',
      visible: false,
      destroyOnClose: false,
      checked: false,
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
    delete this.state.checked;
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
  handClick:function(){
    this.state.publish_info = JSON.stringify(this.refs.form.getValue());
    this.setState(this.state)
    this.onClose()
  },
  renderSongMiniCards: function() {
    this.state.tracks = this.state.tracks || [];
    if (this.state.tracks.length === 0) {
      return (
        <ul className='row row_ul'>
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
        <ul className='row row_ul'>
          {items}
          <AddCardTips
            data-type='Song'
            onClick={this.changeSearchBoxType.bind(null, 'Song')}
            iconClassName='plus'
            title={window.lang.al_addtr} />
        </ul>
      );
    }
  },

  renderArtistMiniCards: function() {
    this.state.artists = this.state.artists || [];
    if (this.state.artists.length === 0) {
      return (
        <ul className='row row_ul'>
          <AddCardTips
            data-type='Artist'
            onClick={this.changeSearchBoxType.bind(null, 'Artist')}
            iconClassName='plus'
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
        <ul className='row row_ul'>
          {items}
          <AddCardTips
            data-type='Artist'
            onClick={this.changeSearchBoxType.bind(null, 'Artist')}
            iconClassName='plus'
            title={window.lang.al_addar} />
        </ul>
      );
    }
  },

  handleChecked: function (ev) {
    this.state.checked = ev.target.checked
    this.setState(this.state)
    if(ev.target.checked){
      let arr = []
      for(let i in mydata){
        mydata[i].all = true
        for(let j in mydata[i].children){
          mydata[i].children[j].checked = true
        }
        arr.push(mydata[i])
      }
      this.state.publish_info = JSON.stringify(arr)
      this.setState(this.state)
      this.onClose()
    }else{
      let arr = []
      for(let i in mydata){
        mydata[i].all = false
        for(let j in mydata[i].children){
          mydata[i].children[j].checked = false
        }
        arr.push(mydata[i])
      }
      this.state.publish_info = JSON.stringify(arr)
      this.setState(this.state)
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
    var dropSongClassName = classNames('card', 'mt20', 'border', 'card-dropzone', {
      'active': this.state.isDropSongActive
    });
    var dropArtistClassName = classNames('card', 'mt20', 'border', 'card-dropzone', {
      'active': this.state.isDropArtistActive
    });
    let dialog;
    if (this.state.visible) {
      dialog = (
        <Dialog
          visible={this.state.visible}
          animation="zoom"
          maskAnimation="fade"
          onClose={this.onClose}
          className='ablums-dialog'
          title={
            <div className='ablums-dialog-title'>
              <span>高级选项</span>
              <div key="close" onClick={this.onClose}>
              X
              </div>
            </div>}
          mousePosition={this.state.mousePosition}
          footer={
            [
              <List publish_info={this.state.publish_info} ref='form' style={{overflow: 'hidden'}} />,
                <div style={{marginLeft:290}}>
                  <button style={{width:100,height:40}} onClick={this.handClick} type="button" className="btn btn-warning">确定</button>
                  <button style={{width:100,height:40,marginLeft:50}} type="button" className="btn btn-default" onClick={this.onClose}>取消</button>
                </div>
            ]
          }
        >
        </Dialog>
      );
    }
    var hasPower = window.__HASPOWER__;
    return (
      <div className='show-wrap'>
        <div className='t-sb h61'>
          <h3 className='t-sb_detail p-l-20'>专辑编辑</h3>
        </div>
        <div className='edit-wrap has-assist-box'>
          <div className='edit-form card clearfix border'>

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
            <p className='form-control-static form-padding'>{window.lang.al_artist}</p>
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
                <p className='form-control-static form-padding'>{window.lang.al_track}</p>
                {this.renderSongMiniCards()}
              </div>
          }

          <div className='card mt20 border' style={{height: '76px', lineHeight: '34px',}}>
            <div>发行设置：
              <a style={{font: '12px 微软雅黑', color: '#2ed0d7'}}>
                <input checked={this.state.checked} type='checkbox'
                onChange={this.handleChecked} style={{width: 12, height: 12, margin: '0 5px 0 10px'}} />
                发行到全部平台
              </a>
              <button type="button" style={{display: this.state.checked ? 'none' : 'inline-block', marginLeft: 20,}} className="btn btn-warning" onClick={this.onClick}>高级选项</button>
            </div>
          </div>

          <div className='text-left mt20 submit_max'>
            {this.props.children}
          </div>
        </div>
        {dialog}
        <Assist
          type={SearchBoxType}
          selectedItems={selectedItems || []}
          onItemClick={this.handleItemClick}
          clsssName='assist-box-height' />
      </div>
    );
  }

});

module.exports = Form;
