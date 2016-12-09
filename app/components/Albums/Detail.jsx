'use strict';
var React = require('react');
var Reflux = require('reflux');
var AlbumStore = require('../../stores/AlbumStore');
var AlbumActions = require('../../actions/AlbumActions');
var _ = require('lodash');

var SongChart = require('../Common/Charts/SongChart.jsx');
var SongChannelChart = require('../Common/Charts/SongChannelChart.jsx');

var Loader = require('../Common/Loader.jsx');
const mydata = [
{title: 'QQ音乐', all : false,children:[{title: '试听',checked: false},{title: '下载',checked: false},{title: 'VIP',checked: false}]},
{title: '百度音乐', all : false,children:[{title: '试听',checked: false},{title: '下载',checked: false},{title: 'VIP',checked: false}]},
{title: '搜狐音乐', all : false,children:[{title: '试听',checked: false},{title: '下载',checked: false},{title: 'VIP',checked: false}]},
{title: '阿里音乐1', all : false,children:[{title: '试听',checked: false},{title: '下载',checked: false},{title: 'VIP',checked: false}]},
{title: '秀米音乐1',  all : false,children:[{title: '试听',checked: false},{title: '下载',checked: false},{title: 'VIP',checked: false}]},
{title: '阿里音乐2', all : false,children:[{title: '试听',checked: false},{title: '下载',checked: false},{title: 'VIP',checked: false}]},
{title: '秀米音乐2',  all : false,children:[{title: '试听',checked: false},{title: '下载',checked: false},{title: 'VIP',checked: false}]},
{title: '阿里音乐3', all : false,children:[{title: '试听',checked: false},{title: '下载',checked: false},{title: 'VIP',checked: false}]},
{title: 'QQ音乐4', all : false,children:[{title: '试听',checked: false},{title: '下载',checked: false},{title: 'VIP',checked: false}]},
{title: '百度音乐4', all : false,children:[{title: '试听',checked: false},{title: '下载',checked: false},{title: 'VIP',checked: false}]},
{title: '搜狐音乐4', all : false,children:[{title: '试听',checked: false},{title: '下载',checked: false},{title: 'VIP',checked: false}]},
{title: '阿里音乐4', all : false,children:[{title: '试听',checked: false},{title: '下载',checked: false},{title: 'VIP',checked: false}]},]
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
  renderChildren() {
    let obj = JSON.parse(this.state.album.data.publish_info)
    let arr = []
    for(let i in obj){
      if(obj[i].all){
        arr.push(obj[i])
      }
    }
    const publish_info = this.state.album.data.publish_info ? arr : mydata
    return publish_info.map((item, key) => {
      return (
        <li style={{float: 'left', width: '15%'}}>{item.title}</li>
      )
    })
  },
  renderList: function() {
    var data = this.state.album.data || {};
    var tracks = data.tracks || [];
    if (tracks.length == 0) {
      return (
        <li style={{width: 'auto', textAlign: 'center', float: 'none'}}>暂无歌曲信息</li>
      );
    } else {
      return tracks.map(function(item, idx) {
        return (
          <li key={idx} className='col-sm-4 ellipsis p-l-20 p-r-0'>
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
    var data = this.state.album.data || {};
    var photoStyles = {
      backgroundImage: 'url(' + data.photo + ')'
    };
    return (
      <div className='show-wrap'>
        <div className='show-top'>
          <div className='photo pull-left' style={photoStyles}></div>
          <div className='ctrl-btn pull-right'>
            <button
              className='btn btn-warning mr10 btn-w-h'
              onClick={this.props.handleToEdit}>{window.lang.edit}</button>
            <button
              className='btn btn-default btn-w-h'
              onClick={this.handleBack}>{window.lang.back}</button>
          </div>
          <div className='info'>
            <p>{this.filter(data.name)} - {_.collect(data.artists,'name').join(',')}</p>
          </div>
        </div>
        <div className='has-top-bar'>
          <div className='card mt20'>
            <SongChart url={'albums/'+ this.state.album.data.id +'/play_total'} />
          </div>
          <div className='card mt20'>
            <SongChannelChart url={'albums/'+ this.state.album.data.id +'/play_total_sp'}/>
          </div>

          <div className='card mt20'>
            <h4>{window.lang.intro}:</h4>
            <p>{this.filter(data.desc)}</p>
          </div>
          <div className='card mt20'>
            <ul className='row show-song-list'>
              {this.renderList()}
            </ul>
          </div>
          <ul style={{overflow: 'hidden'}}>
            {this.renderChildren()}
          </ul>
        </div>
      </div>
    );
  }

});

module.exports = Detail;
