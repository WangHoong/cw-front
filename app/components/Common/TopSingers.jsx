var React = require('react');
var Reflux = require('reflux');
const TopsingerStore = require('app/stores/TopsingerStore');
const TopsingerActions = require('app/actions/TopsingerActions');
import {Link} from 'react-router'
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
    _artist.link = `/artists/${_artist.artist_id}`

    if(rank<=5){
    return (
      <tr className='row margin0'>
        <td className='col-sm-1 p-l-0 p-r-0'><b className={_artist.classname}>{rank}</b></td>
        <td className="col-sm-3 p-l-0 p-r-0 tsr-avatar" style={_style}><Link to={_artist.link}></Link></td>
        <td className="col-sm-6 p-l-0 p-r-0 tsr-name"><Link to={_artist.link}>{_artist.artist_name}</Link></td>
        {/* <td className="col-sm-2 p-l-0 p-r-0 tsr-name text-center"><Link to={_artist.link}>{_artist.stream_count}</Link></td> {/* 专辑数 */} */}
        {/* <td className="col-sm-2 p-l-0 p-r-0 tsr-name text-center"><Link to={_artist.link}>{_artist.stream_count}</Link></td> {/* 歌曲数 */} */}
        <td className="col-sm-2 p-l-0 p-r-0 tsr-num tsr-name text-center"><Link to={_artist.link}>{_artist.stream_count}</Link></td>  {/* 总播放量 */}
      </tr>
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

  render: function(){

    if(this.state.topsinger.loaded&&this.state.topsinger.data.data.data[0]){
    return(
      <div className="topSingers">
        <p className="tsr-title"><b>{window.lang.at5}</b></p>
        <table className='table-song'>
          <thead>
            <tr className='row margin0'>
              <th className='col-sm-10 p-l-0 p-r-0' colSpan='3' style={{paddingLeft: '90px'}}><b>{window.lang.artist}</b></th>
              {/* <th className='col-sm-2 p-l-0 p-r-0 text-center'>专辑数</th> */}
              {/* <th className='col-sm-2 p-l-0 p-r-0 text-center'>歌曲数</th> */}
              <th className='col-sm-2 p-l-0 p-r-0 text-center'>{window.lang.at5tp}</th>
            </tr>
          </thead>
          <tbody>
            {this.state.topsinger.data.data.data.map(function(artist,i){
              return <ArtistItemWrapper data={artist} key={artist.artist_id} rank={i}/>
            })}
          </tbody>
        </table>
      </div>
    )}else {
      return(
        <div className="topSingers">
          <p className="tsr-title"><b>{window.lang.at5}</b></p>
          <table className='table-song'>
            <thead>
              <tr className='row margin0'>
                <th className='col-sm-10 p-l-0 p-r-0' colSpan='3' style={{paddingLeft: '90px'}}><b>{window.lang.artist}</b></th>
                {/* <th className='col-sm-2 p-l-0 p-r-0 text-center'>专辑数</th> */}
                {/* <th className='col-sm-2 p-l-0 p-r-0 text-center'>歌曲数</th> */}
                <th className='col-sm-2 p-l-0 p-r-0 text-center'>{window.lang.at5tp}</th>
              </tr>
            </thead>
          </table>
          <div className='nodata' style={{marginTop: 95}}>{window.lang.nodata}</div>
        </div>
      )
    }
  }
})
module.exports =TopSingers;
