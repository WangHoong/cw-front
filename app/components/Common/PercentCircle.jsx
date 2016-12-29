var React = require('react');
var dbg = require('debug')('topdmc:Common/PercentCircle');
var CirCanvasProcess = require('./CirCanvasProcess.jsx');
var Reflux = require('reflux');
// const TotalDataStore = require('app/stores/TotalDataStore');
// const TotalDataActions = require('app/actions/TotalDataActions');
var OrderInfoStore = require('app/stores/OrderInfoStore');
var OrderInfoActions = require('app/actions/OrderInfoActions');

var PercentCircle = React.createClass({
  mixins: [Reflux.connect(OrderInfoStore, 'orderinfo')],
  componentDidMount: function() {
    OrderInfoActions.get()
  },
  // mixins: [Reflux.connect(TotalDataStore, 'totalData')],
  //
  // componentDidMount: function() {
  //   TotalDataActions.get();
  // },
  number: function(){
    var items = this.state.orderinfo.data.data.data.items;
    var arr = [];
    for (var i in items) {
      if(items[i].authorization.isnew == 1) {
        arr.push(items[i].authorization)
      }
    }
    return arr
  },
  noAuthorized: function() {
    var items = this.state.orderinfo.data.data.data.items;
    var arr = [];
    for (var i in items) {
      if(items[i].status !== 1) {
        arr.push(items[i].status)
      }
    }
    return arr
  },
  render: function() {
    // var songNumber=this.props.percent[0].split('/');
    // var songPercent=(songNumber[0]/songNumber[1]*100).toFixed(0);
    // var singerNumber=this.props.percent[1].split('/');
    // var singerPercent=(singerNumber[0]/singerNumber[1]*100).toFixed(0);
    // var specialNumber=this.props.percent[2].split('/');
    // var specialPercent=(specialNumber[0]/specialNumber[1]*100).toFixed(0);
    // <div className='datum-percent'>
      //   <p>{window.lang.pr0}</p>
      //   <ul className='row'>
      //     <li className='col-xs-4'>
      //       <CirCanvasProcess process={songPercent} color='#f48daf' height='120' width='120' />
      //       <p>{window.lang.pr1}</p>
      //     </li>
      //     <li className='col-xs-4'>
      //       <CirCanvasProcess process={singerPercent} color='#62a1d5' height='120' width='120' />
      //       <p>{window.lang.pr2}</p>
      //     </li>
      //     <li className='col-xs-4'>
      //       <CirCanvasProcess process={specialPercent} color='#2ed0d7' height='120' width='120' />
      //       <p>{window.lang.pr3}</p>
      //     </li>
      //   </ul>
      // </div>
    if (this.state.orderinfo.loaded) {
      var dataT = this.state.orderinfo.data.data.data;
      return (
        <div className="totalcard">
            <p className="ttc-title">
              <b>分发渠道</b>
              <a className='look' onClick={this.props.onClick}>查看详情</a>
              <b className='sub' style={{display: this.number().length > 0 ? 'inline-block' : 'none'}}>{this.number().length}</b>
            </p>
            <p className="ttc-sum"><span>{dataT.total}</span><span className="ttc-unit">种</span></p>
            <div className="ttc-class">
              <div className='row account' style={{marginBottom: '8px'}}>
                <div className='col-sm-8'>
                  <p>已授权</p>
                  <p className="ttc-num"><span>{dataT.items.length}</span><span className="ttc-unit rmb">个</span></p>
                </div>
                <div className='col-sm-4'>
                  <p>未授权</p>
                  <p className="ttc-num"><span>{this.noAuthorized().length}</span><span className="ttc-unit rmb">个</span></p>
                </div>
              </div>
            </div>
        </div>
      )
    } else {
      return (
        <div className='OrderInfoCard row margin0' style={{color: '#fff'}}>
          暂无请求
        </div>
      )
    }
  }
})
module.exports = PercentCircle;
export default PercentCircle;
