var React = require('react');
var Reflux = require('reflux');
var OrderInfoStore = require('../../stores/OrderInfoStore')
var OrderInfoActions = require('../../actions/OrderInfoActions')
var Item = React.createClass({
  getInitialState: function() {
    return {
      value: this.props.data.status
    };
  },
  chooseCheck: function() {
    this.setState({
      value: 3
    })
  },
  chooseCircle: function() {
    var id = this.props.data.authorization.id;
    var param = {
      status: 2
    }
    OrderInfoActions.update(id, param);
    this.setState({
      value: 2
    })
  },
  makeSure: function() {
    var id = this.props.data.authorization.id;
    var param = {
      status: 1
    }
    OrderInfoActions.update(id, param);
    this.setState({
      value: 1
    })
  },
  authorized: function() {
    var status = this.props.data.status;
    if (status == 1) {
      return <img src='images/albums_checked.png' />
    }else {
      return <img src='images/albums_check.png' onClick={this.chooseCheck} />
    }
  },
  render: function() {
    var _order = this.props.data.authorization;
    // console.log(this.authorized())
    switch (this.state.value) {
    case 0 :
      return (
        <div className='oi-item'>
          <div className='oi-img'><img src={_order.icon_url || '/images/sp_default_logo.jpg'}/></div>
          <div className='oi-name'>
            <p className='oi-name-p'>{_order.company_name}</p>
          </div>
          <p className='oi-price'>￥{_order.price}/1000{window.lang.times}</p>
          <a href="javascript:void(0)">
            <div className='oi-choose'>
              {/* <i className='fa fa-exclamation-circle grayi' onMouseOver={this.chooseCheck}></i> */}
              {this.authorized()}
            </div>
          </a>
        </div>
    );
    break;
    case 1 :
      return (
        <div className='oi-item'>
          <div className='oi-img'><img src={_order.icon_url || '/images/sp_default_logo.jpg'}/></div>
          <div className='oi-name'>
            <p className='oi-name-p'>{_order.company_name}</p>
          </div>
          <p className='oi-price'>￥{_order.price}/1000{window.lang.times}</p>
          <div className='oi-choose'>
            {/* <i className='fa fa-check grayi' style={{color: '#12bdc4'}}></i> */}
            {this.authorized()}
          </div>
        </div>
    );
    break;
    case 2 :
      return (
        <div className='oi-item'>
          <div className='oi-img'><img src={_order.icon_url || '/images/sp_default_logo.jpg'}/></div>
          <div className='oi-name'>
            <p className='oi-name-p'>{_order.company_name}</p>
          </div>
          <p className='oi-price'>￥{_order.price}/1000{window.lang.times}</p>
          <a href="javascript:void(0)">
            <div className='oi-choose'>
              {/* <i className='fa fa-ban grayi' onClick={this.chooseCheck}></i> */}
              <img src='images/albums_check.png' onClick={this.chooseCheck} />
            </div>
          </a>
        </div>
    );
    break;
    default :
      return (
          <div className='oi-item'>
            <a href="javascript:void(0)">
              <div className='oi-chooseYes' onClick={this.makeSure}>
                {/* <i className='fa fa-check greeni'></i> */}
                <img className='greeni' src='images/albums_checked.png' />
                <span>{window.lang.lic}</span>
              </div>
            </a>
            <a href="javascript:void(0)">
              <div className='oi-chooseNo' onClick={this.chooseCircle}>
                <i className='fa fa-ban redi'></i>
                <span>{window.lang.dontlic}</span>
              </div>
            </a>
          </div>

      )
    }
  }
})
var OrderInfo = React.createClass({
  mixins: [Reflux.connect(OrderInfoStore, 'orderinfo')],
  componentDidMount: function() {
    OrderInfoActions.get()
  },
  render: function() {
    var isGlobal = window.location.hostname.indexOf('global') != -1 ? true : false
    const {isNew} = this.props
    if (this.state.orderinfo.loaded) {
      return (
        <div className='OrderInfoCard row margin0'>
          {this
            .state
            .orderinfo
            .data
            .data
            .data
            .items
            .map(function (track, i) {
              if (track.authorization.isnew === isNew) {
                return (
                  <Item data={track} key={i} />
                )
              }
            })}
        </div>
      )
    } else {
      return (
        <div className='OrderInfoCard row margin0'>
          暂无请求
        </div>
      )
    }

  }
})
module.exports = OrderInfo;
export default OrderInfo;
