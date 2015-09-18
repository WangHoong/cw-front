var React = require('react');
var Reflux = require('reflux');
const TopsongStore = require('app/stores/TopsongStore');
const TopsongActions = require('app/actions/TopsongActions');
const dbg = require('debug')('topdmc:TopSongs/component');

var TopTrackItemWrapper = React.createClass({
  render: function(){
		let isTop3 = _ => _ < 4;
    var rank = this.props.rank+1;
    var maxWidth = 80, maxNum = this.props.maxNum, _track = this.props.data;
    var bglWidth = (_track.stream_count / maxNum )* maxWidth;
    bglWidth = bglWidth+'%';
    // dbg('id=' + _track.id, 'bglWidth=' + bglWidth);
    var _style = { width: bglWidth };
		let classnameOfBadge, classnameOfBar;
    if( isTop3(rank) ) {
			classnameOfBadge = 'tps-rank-top';
			classnameOfBar = 'tps-bgl-top';
    }
		else {
      classnameOfBadge = 'tps-rank-other';
      classnameOfBar = 'tps-bgl-other';
		}
    _track.link = `#/songs/${_track.track_id}`
    var name = _track.artists[0].name || '暂无';

    return (
      <p className="tps-member">
        <span className={classnameOfBadge}><b>{rank}</b></span>
        <span className={classnameOfBar} style={_style}>
        	<span className="tps-song"><b><a href={_track.link}>{_track.track_name}-</a></b><a href={_track.link2}><span>{name}</span></a></span>
        </span>
        <span className="tps-num">{_track.stream_count}</span>
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
		const MAXNUM = 10000000;
		let stateTS = this.state.topsong;
		let topTracks10 = stateTS && stateTS.data && stateTS.data.data;
		let maxNum = (topTracks10 && topTracks10.data && Number(topTracks10.data[0].stream_count)) || MAXNUM;
    if(stateTS.loaded && (maxNum!==MAXNUM)){
    return(
      <div className="topSongs">
        <p className="tps-title"><b>歌曲TOP10</b></p>
        <div className="tps-body">
          { topTracks10.data.map(function(track,i){
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
