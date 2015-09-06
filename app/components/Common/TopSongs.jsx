var React = require('react');
var Reflux = require('reflux');
const TopsongStore = require('app/stores/TopsongStore');
const TopsongActions = require('app/actions/TopsongActions');
const dbg = require('debug')('topdmc:TopSongs/component');

var TopTrackItemWrapper = React.createClass({
  render: function(){
    var rank = this.props.rank+1;
    var maxWidth = 80, maxNum = this.props.maxNum, _track = this.props.data;
    var bglWidth = (_track.count / maxNum )* maxWidth;
    bglWidth = bglWidth+'%';
    // dbg('id=' + _track.id, 'bglWidth=' + bglWidth);
    var _style = { width: bglWidth };
    var classnameOfBadge = 'tps-rank-top', classnameOfBar = 'tps-bgl-top';
    if(rank > 3){
      classnameOfBadge = 'tps-rank-other';
      classnameOfBar = 'tps-bgl-other';
    }
    _track.link = `#/songs/${_track.track_id}`
    var name='暂无';
    if(_track.artists[0].name){
      name = _track.artists[0].name;
    }

    return (
      <p className="tps-member">
        <span className={classnameOfBadge}><b>{rank}</b></span>
        <span className={classnameOfBar} style={_style}>
        <span className="tps-song"><b><a href={_track.link}>{_track.track_name}-</a></b><a href={_track.link2}><span>{name}</span></a></span>
        </span>
        <span className="tps-num">{_track.count}</span>
      </p>
    );
  }
});

var TopSongs = React.createClass({
  mixins: [Reflux.connect(TopsongStore, 'topsong')],

  componentDidMount: function() {
    TopsongActions.find();
  },



  render: function(){
    var maxNum = 10000000;
    if(this.state.topsong&&this.state.topsong.data&&this.state.topsong.data.data){
      this.state.topsong.data.data.data.forEach(function(item,i){
        if(i==0){maxNum=item.count;}
      });
    }
    console.log(this.state.topsong);
    if(this.state.topsong.loaded&&this.state.topsong.data.data.data[0]){
    return(
      <div className="topSongs">
        <p className="tps-title"><b>歌曲TOP10</b></p>
        <div className="tps-body">
          { this.state.topsong.data.data.data.map(function(track,i){
            return <TopTrackItemWrapper data={track} key={track.track_id} maxNum={maxNum} rank={i}/>
          }) }
        </div>
      </div>
    );}else {
      return(
        <div className="topSongs">
          <p className="tps-title"><b>歌曲TOP10</b></p>
          <div className='nodata'>暂无数据</div>        
        </div>

      )
    }
  }
})
module.exports = TopSongs;
