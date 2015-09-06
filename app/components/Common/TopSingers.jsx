var React = require('react');
var Reflux = require('reflux');
const TopsingerStore = require('app/stores/TopsingerStore');
const TopsingerActions = require('app/actions/TopsingerActions');
var ArtistItemWrapper = React.createClass({

  render: function(){
    // 前三名使用粉色,其他使用默认色
    var _artist = this.props.data;
    var rank = this.props.rank+1;
    _artist.classname = "tsr-rank-top";
    if(rank > 3){
      _artist.classname = "tsr-rank-other";
    }
    // set default artist avatar
    var imgUrl = _artist.artist_photo || 'images/loading.gif';
    var _style={ backgroundImage:'url(' + imgUrl + ')' }
    // set _artist.link
    _artist.link = `#/artists/${_artist.artist_id}`

    if(rank<=5){
    return (
      <p>
        <span className={_artist.classname}><b>{rank}</b></span>
        <a href={_artist.link}>
        <span className="tsr-avatar" style={_style}></span>
        <span className="tsr-name">{_artist.artist_name}</span>
        <span className="tsr-num">{_artist.count}</span></a>
      </p>
    );
  }else {
    return <p></p>;
  }
  }
});

var TopSingers = React.createClass({
  mixins: [Reflux.connect(TopsingerStore, 'topsinger')],

  componentDidMount: function() {
    TopsingerActions.find();
  },
  // getInitialState: function() {
  //   return {
  //     data2: [
  //       {rank: 1, avatar: "http://i.gtimg.cn/music/photo/mid_singer_500/I/o/003NThQh3ujqIo.jpg", name: "周华健", num: 62145368, id: 96},
  //       {rank: 2, avatar: "http://i.gtimg.cn/music/photo/mid_singer_500/N/k/000GGDys0yA0Nk.jpg", name: "梁静茹", num: 61145368, id: 44},
  //       {rank: 3, avatar: "http://i.gtimg.cn/music/photo/mid_singer_500/c/6/000cISVf2QqLc6.jpg", name: "莫文蔚", num: 59145368, id: 54},
  //       {rank: 4, avatar: "http://i.gtimg.cn/music/photo/mid_singer_500/c/z/0000mFvh1jtLcz.jpg", name: "张信哲", num: 56145368, id: 167},
  //       {rank: 5, avatar: "http://i.gtimg.cn/music/photo/mid_singer_500/l/q/00235pCx2tYjlq.jpg", name: "许巍", num: 48145368, id: 3376}
  //     ]
  //   };
  // },


  render: function(){

    console.log(this.state.topsinger);
    if(this.state.topsinger.loaded){

    return(
      <div className="topSingers">
        <p className="tsr-title"><b>艺人Top5</b></p>
        <p className="tsr-head">
          <span className="tsr-rank"><b>排名</b></span>
          <span className="tsr-singer"><b>艺人</b></span>
          <span className="tsr-total"><b>总播放量</b></span>
        </p>
        <div className="tsr-body">
          {this.state.topsinger.data.data.data.map(function(artist,i){
            return <ArtistItemWrapper data={artist} key={artist.artist_id} rank={i}/>
          })}
        </div>
      </div>
    )}else {
      return(<div>暂无数据</div>)
    }
  }
})
module.exports =TopSingers;
