'use strict';
var React = require('react');
var Reflux = require('reflux');
var SongStore = require('../../stores/SongStore');
var SongActions = require('../../actions/SongActions');
var AlbumMiniCard = require('../Albums/MiniCard.jsx');
var ArtistMiniCard = require('../Artists/MiniCard.jsx');
var StringUtil = require('../../utils/StringUtil');

var SongChart = require('../Common/Charts/SongChart.jsx');
var SongChannelChart = require('../Common/Charts/SongChannelChart.jsx');

var Loader = require('../Common/Loader.jsx');
var Item = require ('./Dsps/Item.jsx');
var Player = require('../Common/Player/Player.jsx');
var mydata = require('./Dsps/DefaultData.jsx');
var Detail = React.createClass({

  mixins: [Reflux.connect(SongStore, 'song')],

  componentDidMount: function () {
    SongActions.get(this.props.id);
    this.getTrackUrl();
  },

  renderAlbumMiniCards: function () {
    this.state.song.data.albums = this.state.song.data.albums || [];
    var self = this;
    return this.state.song.data.albums.map(function (item) {
      return (
        <AlbumMiniCard data={item} key={item.id} readonly={true} onRemove={self.handleRemoveAlbum}/>
      );
    });
  },

  renderArtistMiniCards: function () {
    this.state.song.data.artists = this.state.song.data.artists || [];
    var self = this;
    return this.state.song.data.artists.map(function (item) {
      return (
        <ArtistMiniCard data={item} key={item.id} readonly={true} onRemove={self.handleRemoveAlbum}/>
      );
    });
  },
  filter:function(value){
    return value.split('\\n').join('<p></p>');
  },
  handleBack: function() {
    history.go(-1);
  },
  renderCopyright: function(data) {
    if (!data.copyRight) {
      return <p className='mt10'>版权信息暂未录入</p>;
    }
    var copyright = data.copyRight;
    return (
      <div className='mt10'>
        <p>版权方：{copyright.company && copyright.company['name'] || '暂无'}</p>
        <p>版权有效期：{copyright.expired && moment(copyright.expired).format('YYYY年MM月DD日') || '暂无'}</p>
        <p>独家授权：{copyright.client && copyright.client['name'] || '暂无'}</p>
        <p>授权有效期：{copyright.client_expired && moment(copyright.client_expired).format('YYYY年MM月DD日') || '暂无'}</p>
      </div>
    );
  },
  getTrackUrl: function() {
    var url = null;
    if (this.state.song.data.play_url_128) {
      url = this.state.song.data.play_url_128;
      return url;
    }
    if (this.state.song.data.play_url_320) {
      url = this.state.song.data.play_url_320;
      return url;
    }
    return url;
  },
  renderPlayer: function() {
    var _hostname = window.location.hostname;
    if (_hostname.indexOf('global') != -1) {
      var trackUrl = this.getTrackUrl();
      if (trackUrl == null) {
        return (
          <div className='card mt20 margin0 border'>
            <div className='player-panel'>
              <p className='no-data'>词曲暂不支持试听</p>
            </div>
          </div>
        );
      }
      return (
        <div className='card mt20 margin0 border'>
          <Player url={trackUrl} bg={this.state.song.data.album.photo} />
        </div>
      );
    } else {
      return (
        <span />
      );
    }
  },
  renderChildren() {
    let obj = JSON.parse(this.state.song.data.publish_info)
    let arr = []
    for(let i in obj){
      if(obj[i].all){
        arr.push(obj[i])
      }
    }
    const publish_info = arr.length > 0 ? arr : mydata
    return publish_info.map((item, key) => {
      return (
        <li key={key}>
          <Item dsp={item} id={key} className='detail-dsps-item' itemChecked = {null} ItemClick = {null} />
        </li>
      )
    })
  },
  render: function () {
    if (!this.state.song.loaded) {
      return <Loader />;
    }
    var data = this.state.song.data || {};
    var photoStyles = {
      backgroundImage: 'url(' + (data.album||{}).photo + ')'
    };
    var albums = this.state.song.data.albums || [{'name': ''}];
    return (
      <div className='show-wrap'>
        <div className='show-top'>
          {/* <div className='photo pull-left' style={photoStyles}></div> */}
          <div className='ctrl-btn pull-right'>
            <button
                className='btn btn-warning mr10 btn-w-h'
                onClick={this.props.onEditClick}>{window.lang.edit}</button>
            <button
              className='btn btn-default btn-w-h'
              onClick={this.handleBack}>{window.lang.back}</button>
          </div>
          <div className='info'>
            <p className='data'>{data.name} - {(data.album||{}).name}</p>
          </div>
        </div>
        <div className='has-top-bar'>
          {/* <div className='card mt20'> */}
            {this.renderPlayer()}
          {/* </div> */}
          <div className='card margin0 border'>
            <SongChart url={'tracks/'+ this.state.song.data.id +'/play_total'} />
          </div>
          <div className='card mt20 margin0 border'>
            <SongChannelChart url={'tracks/'+ this.state.song.data.id +'/play_total_sp'} />
          </div>
          <div className='card mt20 margin0 border'>
            <div>
              <p>歌手：</p>
              <ul className="search-box-results clearfix">{this.renderArtistMiniCards()}</ul>
            </div>
          </div>
          <div className='card mt20 margin0 border'>
            <p className='data mt20' dangerouslySetInnerHTML={{__html:this.filter(data.lrc || ' 暂无 ')}}></p>
          </div>
          <div className='card mt20 margin0 border'>
            <p>
              <span>
                发行展示
              </span>
            </p>
            <div>
              <ul className='detail-dsps-ul'>
                {this.renderChildren()}
              </ul>
            </div>
          </div>

        </div>
      </div>
    );
  }

});

module.exports = Detail;
