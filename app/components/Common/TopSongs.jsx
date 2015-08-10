var React = require('react');
var Reflux = require('reflux');
const TopsongStore = require('app/stores/TopsongStore');
const TopsongActions = require('app/actions/TopsongActions');
const dbg = require('debug')('topdmc:TopSongs/component');

var TopTrackItemWrapper = React.createClass({
  render: function(){
    var rank = this.props.rank+1;
    var maxWidth = 80, minWidth = 150, maxNum = this.props.maxNum, _track = this.props.data;
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
        <span className="tps-song"><b><a href={_track.link}>{_track.track_name}-</a></b></span>
        <a href={_track.link2}><span>{name}</span></a>
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
  getInitialState: function() {
    return {
      data: [
        {"rank":"1","name":"十年","singer":"陈奕迅","num":"2973194","link":"#/songs/8804","link2":"#/artists/143", id: 8804},
        {"rank":"2","name":"勇气","singer":"梁静茹","num":"2534453","link":"#/songs/1378","link2":"#/artists/44", id: 1378},
        {"rank":"3","name":"过火","singer":"张信哲","num":"2473119","link":"#/songs/7269","link2":"#/artists/167", id: 7269},
        {"rank":"4","name":"吻别","singer":"张学友","num":"2371034","link":"#/songs/12651","link2":"#/artists/174", id: 12651},
        {"rank":"5","name":"奔跑","singer":"羽泉","num":"2273643","link":"#/songs/4965501","link2":"#/artists/4564", id: 4965501},
        {"rank":"6","name":"海阔天空","singer":"BEYOUND","num":"2175133","link":"#/songs/104786","link2":"#/artists/2", id: 104786},
        {"rank":"7","name":"王妃","singer":"萧敬腾","num":"2074198","link":"#/songs/616147","link2":"#/artists/13203", id: 616147},
        {"rank":"8","name":"青春修炼手册","singer":"TFBOYS","num":"1871114","link":"#/songs/7094168","link2":"#/artists/34412", id: 7094168},
        {"rank":"9","name":"你是我的眼","singer":"林宥嘉","num":"1773103","link":"#/songs/4962593","link2":"#/artists/11606", id: 4962593},
        {"rank":"10","name":"RADIO","singer":"孙燕姿","num":"1671940","link":"#/songs/102175832","link2":"#/artists/109", id: 102175832}
      ]
    }
  },


  render: function(){
    var maxNum = 10000000;
    if(this.state.topsong&&this.state.topsong.data&&this.state.topsong.data.data){
      this.state.topsong.data.data.data.forEach(function(item,i){
        if(i==0){maxNum=item.count;}
      });
    }
    return(
      <div className="topSongs">
        <p className="tps-title"><b>歌曲TOP10</b></p>
        <div className="tps-body">
          { this.state.topsong.data.data.data.map(function(track,i){
            return <TopTrackItemWrapper data={track} key={track.track_id} maxNum={maxNum} rank={i}/>
          }) }
        </div>
      </div>
    );
  }
})
module.exports = TopSongs;
