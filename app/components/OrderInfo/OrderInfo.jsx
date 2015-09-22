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
  render: function() {
    var _order = this.props.data.authorization;
    switch (this.state.value) {
    case 0 :
      return (
      <div className='col-sm-4'>
        <div className='oi-item'>
          <div className='oi-img'><img src='/images/sp_default_logo.jpg'/></div>
          <div className='oi-name'>
            <p>{_order.company_name}</p>
            <p className='oi-price'>￥{_order.price}元/1000次</p>
          </div>
          <a href="javascript:void(0)">
            <div className='oi-choose'>
              <i className='fa fa-exclamation-circle grayi' onMouseOver={this.chooseCheck}></i>
            </div>
          </a>
        </div>
      </div>

    );
    break;
    case 1 :
      return (
      <div className='col-sm-4'>
        <div className='oi-item'>
          <div className='oi-img'><img src='/images/sp_default_logo.jpg'/></div>
          <div className='oi-name'>
            <p>{_order.company_name}</p>
            <p className='oi-price'>￥{_order.price}元/1000次</p>
          </div>
          <div className='oi-choose'>
            <i className='fa fa-check grayi'></i>
          </div>
        </div>
      </div>

    );
    break;
    case 2 :
      return (
      <div className='col-sm-4'>
        <div className='oi-item'>
          <div className='oi-img'><img src='/images/sp_default_logo.jpg'/></div>
          <div className='oi-name'>
            <p>{_order.company_name}</p>
            <p className='oi-price'>￥{_order.price}元/1000次</p>
          </div>
          <a href="javascript:void(0)">
            <div className='oi-choose'>
              <i className='fa fa-ban grayi' onMouseOver={this.chooseCheck}></i>
            </div>
          </a>
        </div>
      </div>

    );
    break;
    default :
      return (
        <div className='col-sm-4'>
          <div className='oi-item'>
            <a href="javascript:void(0)">
              <div className='oi-chooseNo' onClick={this.chooseCircle}>
                <i className='fa fa-ban redi'></i>
                <span>暂不售卖</span>
              </div>
            </a>
            <a href="javascript:void(0)">
              <div className='oi-chooseYes' onClick={this.makeSure}>
                <i className='fa fa-check greeni'></i>
                <span>通过申请</span>
              </div>
            </a>
          </div>
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
    if (this.state.orderinfo.loaded) {
      return (
        <div className='OrderInfoCard row'>
          {this
            .state
            .orderinfo
            .data
            .data
            .data
            .items
            .map(function (track, i) {
              return <Item data={track} key={i}/>
            })}
        </div>
      )
    } else {
      return (
        <div className='OrderInfoCard row'>
          暂无请求
        </div>
      )
    }

  }
})
module.exports = OrderInfo;
