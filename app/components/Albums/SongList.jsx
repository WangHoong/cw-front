var React = require('react');
var Reflux = require('reflux');
var AlbumSongStore = require('../../stores/AlbumSongStore');
var AlbumActions = require('../../actions/AlbumActions');

var SongList = React.createClass({

  mixins: [Reflux.connect(AlbumSongStore, 'data')],

  componentDidMount: function () {
    AlbumActions.getSongs(this.props.id);
  },

  renderList: function() {
    var data = this.state.data;
    if (data.items.length == 0) {
      return (
        <li style={{width: 'auto', textAlign: 'center', float: 'none'}}>暂无歌曲信息</li>
      );
    } else {
      return data.items.map(function(item, idx) {
        return (
          <li key={idx} className='ellipsis'>
            <span className='name'>{idx + 1}</span>
            <span>{item.name}</span>
          </li>
        );
      }.bind(this));
    }
  },

  render: function() {
    return (
      <div className='s-song-list-box topdmc'>
        <ul className='clearfix'>
          {this.renderList()}
        </ul>
      </div>
    );
  }

});

module.exports = SongList;
