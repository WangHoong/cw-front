'use strict';
var React = require('react');
var Reflux = require('reflux');
var AlbumStore = require('../../stores/AlbumStore');
var AlbumActions = require('../../actions/AlbumActions');
var _ = require('lodash');

var SongChart = require('../Common/Charts/SongChart.jsx');
var SongChannelChart = require('../Common/Charts/SongChannelChart.jsx');
var mydata = require('./Dsps/DefaultData.jsx');
var Loader = require('../Common/Loader.jsx');
var assign = require('object-assign');
var Item = require ('./Dsps/Item.jsx');
var Detail = React.createClass({

  mixins: [Reflux.connect(AlbumStore, 'album')],

  contextTypes: {
    router: React.PropTypes.func
  },
  getInitialState: function () {
    var defaultState = assign({
      isShow: false
    }, this.props.data);
    return defaultState;
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
    evt.preventDefault();
    var id = evt.target.parentNode.getAttribute('data-id');
    this.context.router.transitionTo('show_edit_song', {id: id}, {});
  },
  mouseOverHandle() {
    this.state.isShow = true
    this.setState(this.state)
  },
  mouseOutHandle() {
    this.state.isShow = false
    this.setState(this.state)
  },
  renderChildren() {
    let obj = JSON.parse(this.state.album.data.publish_info)
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
  renderList: function() {
    var data = this.state.album.data || {};
    var tracks = data.tracks || [];
    if (tracks.length == 0) {
      return (
        <li style={{width: 'auto', textAlign: 'center', float: 'none',marginBottom: '20px'}}>暂无歌曲信息</li>
      );
    } else {
      return tracks.map(function(item, idx) {
        return (
          <li key={idx} className='col-sm-4 ellipsis p-l-20 p-r-0 p-b-20'>
            <a data-id={item.id} onClick={this.handleSongsClick}><span className='name'>{idx + 1}</span>{item.name}</a>
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
      <div className='show-wrap topdmc'>
        <div className='show-top topdmc'>
          {/* <div className='photo pull-left' style={photoStyles}></div> */}
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
        <div className='has-top-bar topdmc'>
          <div className='card margin0 border'>
            <SongChart url={'albums/'+ this.state.album.data.id +'/play_total'} />
          </div>
          <div className='card mt20 margin0 border'>
            <SongChannelChart url={'albums/'+ this.state.album.data.id +'/play_total_sp'}/>
          </div>

          <div className='card mt20 p-b-10 margin0 border'>
            <h4 className='intro p-b-20 margin0'>{window.lang.intro}:</h4>
            <p className='solid'>{this.filter(data.desc)}</p>
            <ul className='row show-song-list row_ul'>
              {this.renderList()}
            </ul>
          </div>
          <div className='card mt20 margin0 border' style={{marginBottom:140,paddingBottom:280}}>
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
