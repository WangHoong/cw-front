var React = require('react');
var Reflux = require('reflux');
const dbg = require('debug')('topdmc:TotalCard/component');
const TotalDataStore = require('app/stores/TotalDataStore');
const TotalDataActions = require('app/actions/TotalDataActions');

var TotalCard = React.createClass({

  mixins: [Reflux.connect(TotalDataStore, 'totalData')],

  _generateMoney: function(seed){
    var d = new Date(seed);
    var x2 = d.getMonth();
    var x3 = d.getDate();
    var x4 = d.getHours();
    var x5 = d.getMinutes();
    var x6 = d.getSeconds();
    var x7 = ((Math.random())*10).toFixed(0);
    var x8 = ((Math.random())*10).toFixed(0);
    var money = (x2*123456+x3*80063+x4*3481+x5*59+x6+x7/10+x8/100).toFixed(2);
    return money;
  },
  _mockData: function(seed){
    var money = ((this._generateMoney(seed))/100).toFixed(2);
    var moneygive = 3256.12;
    var moneyungive = (money-moneygive).toFixed(2);
    money=this.addCommas(money);
    moneygive=this.addCommas(moneygive);
    moneyungive=this.addCommas(moneyungive);
    return {money: money, moneygive:moneygive, moneyungive:moneyungive};
  },
  getInitialState: function() {
    return this._mockData(new Date());
  },
  addCommas: function(nStr){
    nStr += '';
    var x = nStr.split('.');
    var x1 = x[0];
    var x2 = x.length > 1 ? '.' + x[1] : '';
    var rgx = /(\d+)(\d{3})/;
    while (rgx.test(x1)) {
      x1 = x1.replace(rgx, '$1' + ',' + '$2');
    }
    return x1 + x2;
  },
  tick: function() {
    this.setState(this._mockData());
    var maxTime = 4, minTime = 1;
    var time = Math.floor(Math.random() * (maxTime - minTime + 1) + minTime) * 1000;
    setTimeout(this.tick, time);
  },

  _subscribeSSE: function(options){
    var self = this;
    this._src = new EventSource('/sse');
    this._src.addEventListener('message', function(e){
      // dbg('sse:message', e.data);
      self.setState(self._mockData(e.data));
    });
    this._src.addEventListener('open', function(e){
      dbg('sse connected');
    });
    this._src.addEventListener('error', function(e){
      dbg('sse:error', e);
      // You can close EventSource to prevent automatilly retry
      // self._src.close();
    }, false);
    window.SSE = this._src;
  },

  componentDidMount: function() {
    if(this.props.type == 0){
      // 客户端模拟
      // this.interval = setTimeout(this.tick,2000);
      //
      // Server端模拟
      // this._subscribeSSE();
      TotalDataActions.get();
    }
  },

  componentWillUnmount: function() {
    // clearInterval(this.interval);
    // if(this.props.type == 0 && !this._src.closed){
    //   this._src.close();
    //   this._src = null;
    // }
  },
  // <div className="ttc-first ">
  //   <p>{window.lang.r1}</p>
  //   <p className="ttc-num"><span>{amount ? amount.recorded_amount : '--'}</span><span className="ttc-unit">{window.lang.rmb}</span></p>
  // </div>
  // <div className="ttc-next">
  //   <p>{window.lang.r2}</p>
  //   <p className="ttc-num"><span>{amount ? amount.unrecorded_amount : '--'}</span><span className="ttc-unit">{window.lang.rmb}</span></p>
  // </div>
  render: function(){
    var createItem;
    let amount = this.state.totalData.amount
    if(this.props.type==0){
      createItem=
        <div className="totalcard">
          <p className="ttc-title"><b>{window.lang.r0}</b></p>
          <p className="ttc-sum"><span>{amount ? amount.amount : '--'}</span><span className="ttc-unit">{window.lang.rmb}</span></p>
          <div className='row mt10'>
            <div className='col-sm-6'>
              <p>{window.lang.r1}</p>
              <p><span>{amount ? amount.recorded_amount : '--'}</span><span>{window.lang.rmb}</span></p>
            </div>
            <div className='col-sm-6'>
              <p>{window.lang.r2}</p>
              <p><span>{amount ? amount.unrecorded_amount : '--'}</span><span>{window.lang.rmb}</span></p>
            </div>
          </div>
          <div className='row mt10'>
            <div className='col-sm-6'>
              <p>{window.lang.r3}</p>
              <p><span>{amount ? amount.withdraw_amount : '--'}</span><span>{window.lang.rmb}</span></p>
            </div>
            <div className='col-sm-6'>
              <p>{window.lang.r4}</p>
              <p><span>{amount ? amount.blocked_amount : '--'}</span><span>{window.lang.rmb}</span></p>
            </div>
          </div>
        </div>
    }else if(this.props.type==1){
      createItem=
      <div className="totalcard">
        <p className="ttc-title"><b>{window.lang.t0}</b></p>
        <p className="ttc-sum"><span>1263</span><span className="ttc-unit">{window.lang.t0_0}</span></p>
        <div className="ttc-class">
          <div className="ttc-first ">
            <p>{window.lang.t1}</p>
            <p className="ttc-num"><span>24</span><span className="ttc-unit">{window.lang.t0_1}</span></p>
          </div>
          <div className="ttc-next">
            <p>{window.lang.t2}</p>
            <p className="ttc-num"><span>6</span><span className="ttc-unit">{window.lang.t0_2}</span></p>
          </div>
        </div>
      </div>

    }
    return(
      <div>
        {createItem}
      </div>

    )
  }
})
module.exports = TotalCard;
