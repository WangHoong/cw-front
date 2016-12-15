/* 首页顶部的「总歌曲数、专辑数、艺人数」 */
var React = require('react');
var Reflux = require('reflux');
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
          <p className="ttc-title"><b>{window.lang.t0}</b></p>
          <p className="ttc-sum"><span>{this.state.totalData.track_total}</span><span className="ttc-unit">{window.lang.t0_0}</span></p>
          <div className="ttc-class">
            <div className='row account' style={{marginBottom: '8px'}}>
              <div className='col-sm-8'>
                <p>{window.lang.t1}</p>
                <p className="ttc-num"><span>{this.state.totalData.album_total}</span><span className="ttc-unit rmb">{window.lang.t0_1}</span></p>
              </div>
              <div className='col-sm-4'>
                <p>{window.lang.t2}</p>
                <p className="ttc-num"><span>{this.state.totalData.artist_total}</span><span className="ttc-unit rmb">{window.lang.t0_2}</span></p>
              </div>
            </div>
          </div>
        </div>
      </div>
    )
  }
});

module.exports = TotalCardOfData;
