/* 首页顶部的「总歌曲数、专辑数、艺人数」 */
const dbg = require('debug')('topdmc:TotalCardOfData/component');
const TotalDataStore = require('app/stores/TotalDataStore');
const TotalDataActions = require('app/actions/TotalDataActions');

var TotalCardOfData = React.createClass({

  mixins: [Reflux.connect(TotalDataStore, 'totalData')],

  componentDidMount: function() {
    TotalDataActions.get();
  },

  render: function(){
    return(
      <div>
        <div className="totalcard">
          <p className="ttc-title"><b>总歌曲数</b></p>
          <p className="ttc-sum"><span>{this.state.totalData.track_total}</span><span className="ttc-unit">首</span></p>
          <div className="ttc-class">
            <div className="ttc-first ">
              <p>专辑数</p>
              <p className="ttc-num"><span>{this.state.totalData.album_total}</span><span className="ttc-unit">张</span></p>
            </div>
            <div className="ttc-next">
              <p>艺人数</p>
              <p className="ttc-num"><span>{this.state.totalData.artist_total}</span><span className="ttc-unit">人</span></p>
            </div>
          </div>
        </div>
      </div>
    )
  }
});

module.exports = TotalCardOfData;
