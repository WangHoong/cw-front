var React = require('react');
var PercentCircle = require('app/components/Common/PercentCircle.jsx');
var TopSongs = require('app/components/Common/TopSongs.jsx');
var TopSingers = require('app/components/Common/TopSingers.jsx');
var SongChart = require('../Common/Charts/SongChart.jsx');
var SongChannelChart = require('../Common/Charts/SongChannelChart.jsx');
var TotalCard = require('app/components/Common/TotalCard.jsx');
var TotalCardOfData = require('app/components/Common/TotalCardOfData.jsx');
var Process = require('app/components/Common/Process.jsx');
var ProcessTips = require('app/components/Common/ProcessTips.jsx');
var OrderInfo = require('app/components/OrderInfo/OrderInfo.jsx');
var GlobalUploadTip = require('app/components/Common/GlobalUploadTip.jsx')

var Dialog = require('rc-dialog');

var Main = React.createClass({
  getInitialState: function () {
    return {
      visible: false,
    }
  },

  onClick (e) {
    this.setState({
      mousePosition: {
        x: e.pageX,
        y: e.pageY,
      },
      visible: true,
    })
  },

  onClose() {
    this.setState({
      visible: false,
    });
  },

  render: function() {
    var _data=["4/7","6/7","3/7"];
    let tip = status<=0 ? (<div className='card'><ProcessTips /></div>) : (<div></div>)

    // 弹框
    let dialog;
    if (this.state.visible) {
      dialog = (
        <Dialog
          visible={this.state.visible}
          animation="slide-fade"
          maskAnimation="fade"
          onClose={this.onClose}
          style={{ width: 600, background: '#fff', }}
          title={<div style={{lineHeight: '40px',fontSize: '18px'}}>音乐电台<a className="fa fa-times" aria-hidden="true" onClick={this.onClose} style={{float: 'right', marginRight: 5}}></a></div>}
          mousePosition={this.state.mousePosition}
          footer={
            [<button
                type="button"
                className="btn btn-default"
                key="close"
                onClick={this.onClose}
              >Close</button>,
              <button
                type="button"
                className="btn btn-primary"
                key="save"
                onClick={this.onClose}
              >Submit</button>,]}>
            <p>nnnnnnnnnnnnnnnn</p>
        </Dialog>
      );
    }
    return (
      <div>
        <div className='dashboard-container'>
          {tip}
          <div className='row dashboard-header'>
            <div className='col-sm-4 p-r-10'>
              <div className='income'>
                <TotalCard type={'0'} />
              </div>
            </div>
            <div className='col-sm-3 p-l-10 p-r-10'>
              <div className='songsum'>
                <TotalCardOfData />
              </div>
            </div>
            <div className='col-sm-5 p-l-10'>
              <div className='datum-percent-wrap' onClick={this.onClick}>
                <PercentCircle percent={_data}/>
              </div>
            </div>
            {dialog}
          </div>
          <div className='mt20'>
              <OrderInfo />
          </div>
          <div className='mt20'>
            <div className='row'>
              <div className='col-sm-12'>
                <div className='card'>
                  <SongChart url={'play_total'} />
                </div>
                <div className='card mt20'>
                  <SongChannelChart url={'play_total_sp'} />
                </div>
              </div>
            </div>
          </div>
          <div className='mt20 mb20'>
            <div className='row'>
              <div className='col-sm-8'>
                <div className='card'>
                  <TopSongs />
                </div>
              </div>
              <div className='col-sm-4'>
                <div className='card'>
                  <TopSingers />
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  }

});

module.exports = Main;
